import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images are allowed" });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });
    const uploadedResults = await Promise.all(uploadPromises);
    const imageUrls = uploadedResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getAllProducts(_, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      stock,
      existingImages,
      imagePositions,
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Сохраняем старый список картинок для сравнения
    const oldImages = product.images || [];

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);

    let existingImagesArr = [];
    if (existingImages) {
      existingImagesArr = Array.isArray(existingImages)
        ? [...existingImages]
        : [existingImages];
    }

    // --- ЛОГИКА ОПРЕДЕЛЕНИЯ УДАЛЕННЫХ КАРТИНОК ---
    // Находим картинки, которые были в продукте, но не пришли в существующем списке (их удалил пользователь)
    const imagesToDelete = oldImages.filter(
      (img) => !existingImagesArr.includes(img),
    );

    // Удаляем неиспользуемые файлы из Cloudinary
    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map((imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    let positionsArr = [];
    if (imagePositions) {
      positionsArr = Array.isArray(imagePositions)
        ? [...imagePositions]
        : [imagePositions];
    }

    let finalImages = [];

    // handle image updates if new images are uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length + existingImagesArr.length > 3) {
        return res
          .status(400)
          .json({ message: "Maximum 3 images are allowed" });
      }
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });
      const uploadedResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadedResults.map((result) => result.secure_url);

      if (positionsArr.length > 0) {
        let eIdx = 0;
        let nIdx = 0;
        for (const pos of positionsArr) {
          if (pos === "existing" && eIdx < existingImagesArr.length) {
            finalImages.push(existingImagesArr[eIdx++]);
          } else if (pos === "new" && nIdx < newImageUrls.length) {
            finalImages.push(newImageUrls[nIdx++]);
          }
        }
      } else {
        finalImages = [...existingImagesArr, ...newImageUrls];
      }
    } else {
      finalImages = existingImagesArr;
    }

    product.images = finalImages;
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(deletePromises);
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllOrders(_, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = Date.now();
    }
    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = Date.now();
    }
    if (status === "cancelled" && !order.cancelledAt) {
      order.cancelledAt = Date.now();
    }
    if (status === "pending" && !order.paidAt) {
      order.paidAt = Date.now();
    }
    await order.save();
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments();

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
    });
  } catch (error) {
    console.error("Error in getDashboardStats controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: "Customers fetched successfully", customers });
  } catch (error) {
    console.error("Error in getAllCustomers controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

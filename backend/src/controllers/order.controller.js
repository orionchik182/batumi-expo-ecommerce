import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) {
  try {
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
    const user = req.user;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    //validate products and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Product ${item.product.name} out of stock` });
      }
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    // update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // // clear cart
    // await Cart.findOneAndUpdate(
    //     { user: user._id },
    //     { items: [] },
    //     { new: true }
    // );

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // check if each order has been reviewed
    const orderIds = orders.map((order) => order._id);
    const reviews = await Review.find({ orderId: { $in: orderIds } });

    // Map order ID to a set of reviewed product IDs
    const reviewedProductsMap = new Map();
    reviews.forEach((review) => {
      const orderIdStr = review.orderId.toString();
      const productIdStr = review.productId.toString();
      if (!reviewedProductsMap.has(orderIdStr)) {
        reviewedProductsMap.set(orderIdStr, new Set());
      }
      reviewedProductsMap.get(orderIdStr).add(productIdStr);
    });

    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        const reviewedProductIds = reviewedProductsMap.get(order._id.toString()) || new Set();
        const hasReviewed = order.orderItems.every(
          (item) => item.product && reviewedProductIds.has(item.product._id.toString())
        );
        return {
          ...order.toObject(),
          hasReviewed,
          hasReview: hasReviewed, // for backwards compatibility
        };
      }),
    );

    res.status(200).json({
      message: "Orders fetched successfully",
      orders: ordersWithReviewStatus,
    });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

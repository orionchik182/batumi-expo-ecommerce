import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    const user = req.user;
    let cart = await Cart.findOne({ clerkId: user.clerkId }).populate(
      "items.product",
    );
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const user = req.user;
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Product out of stock" });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Product out of stock" });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCart controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCartItem(req, res) {
  try {
    const user = req.user;
    const {productId} = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ clerkId: user.clerkId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Product out of stock" });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updateCartItem controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromCart(req, res) {
    try {
        const user = req.user;
        const { productId } = req.params;
        const cart = await Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
       cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString(),
       );
        await cart.save();
        res.status(200).json({ message: "Item removed from cart successfully", cart });
    } catch (error) {
        console.error("Error in removeFromCart controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function clearCart(req, res) {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error("Error in clearCart controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

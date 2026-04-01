import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProductById controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
import { Router } from "express";
import { createProduct, getAllProducts, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getAllCustomers, getDashboardStats } from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/product/:id", upload.array("images", 3), updateProduct);
router.delete("/product/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router;

import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getAllProducts } from "../controllers/admin.controller";
import { getProductById } from "../controllers/product.controller";

const router = Router();

router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);

export default router;
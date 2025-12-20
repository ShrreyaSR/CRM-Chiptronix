import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.get("/verify", authenticate, controller.verify);

export default router;

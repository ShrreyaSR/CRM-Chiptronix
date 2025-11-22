import { Router } from "express";
import { ComplaintController } from "../controllers/ComplaintController";

const router = Router();
const controller = new ComplaintController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;

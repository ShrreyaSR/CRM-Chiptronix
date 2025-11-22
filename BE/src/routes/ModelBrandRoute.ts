import { Router } from "express";
import { ModelBrandController } from "../controllers/ModelBrandController";

const router = Router();
const controller = new ModelBrandController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;

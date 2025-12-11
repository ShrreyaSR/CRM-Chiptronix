import { Router } from "express";
import { TrayController } from "../controllers/TrayController";

const router = Router();
const controller = new TrayController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);
router.post("/bulk", controller.bulkAdd);

export default router;

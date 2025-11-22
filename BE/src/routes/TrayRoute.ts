import { Router } from "express";
import { TrayController } from "../controllers/TrayController";

const router = Router();
const controller = new TrayController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.delete("/:id", controller.delete);
router.patch("/:id", controller.update);
router.post("/bulk", controller.bulkAdd)

export default router;

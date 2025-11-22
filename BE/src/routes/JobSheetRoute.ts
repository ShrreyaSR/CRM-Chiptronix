import { Router } from "express";
import { JobSheetController } from "../controllers/JobSheetController";

const router = Router();
const controller = new JobSheetController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;

import { Router } from "express";
import { ClientController } from "../controllers/ClientController";

const router = Router();
const controller = new ClientController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;

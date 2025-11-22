import { Router } from "express";
import { TechnicianController } from "../controllers/TechnicianController";

const router = Router();
const controller = new TechnicianController();

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);       
router.delete("/:id", controller.delete);    

export default router;
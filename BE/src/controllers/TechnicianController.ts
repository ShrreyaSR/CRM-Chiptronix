import { Request, Response } from "express";
import { TechnicianService } from "../services/TechnicianService";

const service = new TechnicianService();

export class TechnicianController {

  async getAll(req: Request, res: Response) {
    const {search, sortField, sortOrder } = req.query;
    const result = await service.getAllTechnicians({
      search: (search as string) || "",
      sortField: (sortField as string) || "name",
      sortOrder: (sortOrder as string) || "ASC"
    });
    res.json(result);
    console.log("Technician list: ", result);
  }

  async create(req: Request, res: Response) {
    const technician = await service.createTechnician(req.body);
    console.log("Technician added: ", technician);
    res.status(201).json(technician);
  }

    async update(req: Request, res: Response) {
    const updated = await service.updateTechnician(Number(req.params.id), req.body);
    console.log("Empolyee updated: ", updated)
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    await service.deleteTechnician(Number(req.params.id));
    res.json({ message: "Technician deleted successfully" });
  }
  
}

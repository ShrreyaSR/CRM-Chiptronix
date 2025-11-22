import { Request, Response } from "express";
import { ModelBrandService } from "../services/ModelBrandService";

const service = new ModelBrandService();

export class ModelBrandController {
  async getAll(req: Request, res: Response) {
    const {search, sortField, sortOrder } = req.query;

    const result = await service.getAll({
      search: (search as string) || "",
      sortField: (sortField as string) || "brand",
      sortOrder: (sortOrder as string) || "ASC",
    });

    res.json(result);
  }

  async create(req: Request, res: Response) {
    const created = await service.create(req.body);
    res.status(201).json(created);
  }

  async update(req: Request, res: Response) {
    const updated = await service.update(Number(req.params.id), req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    await service.delete(Number(req.params.id));
    res.json({ message: "Deleted successfully" });
  }
}

import { Request, Response, NextFunction } from "express";
import { ModelBrandService } from "../services/ModelBrandService";

const service = new ModelBrandService();

export class ModelBrandController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sortField, sortOrder } = req.query;

      const result = await service.getAll({
        search: (search as string) || "",
        sortField: (sortField as string) || "brand",
        sortOrder: (sortOrder as "ASC" | "DESC") || "ASC",
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await service.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await service.update(Number(req.params.id), req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.delete(Number(req.params.id));
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

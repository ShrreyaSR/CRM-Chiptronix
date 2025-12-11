import { Request, Response, NextFunction } from "express";
import { SalesPersonService } from "../services/SalesPersonService";

const service = new SalesPersonService();

export class SalesPersonController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sortField, sortOrder } = req.query;
      const result = await service.getAllSalesPersons({
        search: (search as string) || "",
        sortField: (sortField as string) || "name",
        sortOrder: (sortOrder as "ASC" | "DESC") || "ASC",
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const salesperson = await service.createSalesPerson(req.body);
      res.status(201).json({ success: true, data: salesperson });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await service.updateSalesPerson(
        Number(req.params.id),
        req.body
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.deleteSalesPerson(Number(req.params.id));
      res.json({
        success: true,
        message: "Salesperson deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

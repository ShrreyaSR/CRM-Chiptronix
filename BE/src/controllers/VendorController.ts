import { Request, Response, NextFunction } from "express";
import { VendorService } from "../services/VendorService";

const service = new VendorService();

export class VendorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sortField, sortOrder } = req.query;

      const result = await service.getAllVendors({
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
      const vendor = await service.createVendor(req.body);
      res.status(201).json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await service.updateVendor(
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
      await service.deleteVendor(Number(req.params.id));
      res.json({ success: true, message: "Vendor deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

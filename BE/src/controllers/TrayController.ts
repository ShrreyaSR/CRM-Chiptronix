import { Request, Response, NextFunction } from "express";
import { TrayService } from "../services/TrayService";
import { logger } from "../utils/logger";

const service = new TrayService();

export class TrayController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { sortField, sortOrder } = req.query;
      const trays = await service.getAllTrays({
        sortField: (sortField as string) || "trayNumber",
        sortOrder: (sortOrder as "ASC" | "DESC") || "ASC",
      });
      res.json({ success: true, data: trays.data, total: trays.total });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tray = await service.getTrayById(Number(id));
      res.json({ success: true, data: tray });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tray = await service.createTray(req.body);
      res.status(201).json({ success: true, data: tray });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tray = await service.updateTray(Number(id), req.body);
      res.json({ success: true, data: tray });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await service.deleteTray(Number(id));
      res.json({ success: true, message: "Tray deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async bulkAdd(req: Request, res: Response, next: NextFunction) {
    try {
      const { totalCount } = req.body;
      const result = await service.bulkUpload(totalCount);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response } from "express";
import { TrayService } from "../services/TrayService";

const service = new TrayService();

export class TrayController {
  async getAll(req: Request, res: Response) {
    const trays = await service.getAllTrays({
      sortField: "trayNumber",
      sortOrder: "ASC"
    })
    res.json(trays);
  }

  async create(req: Request, res: Response) {
    try {
      const tray = await service.createTray(req.body);
      res.status(201).json(tray);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    await service.deleteTray(Number(req.params.id));
    res.json({ message: "Tray deleted successfully" });
  }

  async update(req: Request, res: Response) {
    const updated = await service.updateTray(Number(req.params.id), req.body);
    res.json(updated);
  }

async bulkAdd(req: Request, res: Response) {
  const { totalCount } = req.body;
  const result = await service.bulkUpload(totalCount);
  res.json(result);
}
}

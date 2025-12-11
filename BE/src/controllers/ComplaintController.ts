import { Request, Response, NextFunction } from "express";
import { ComplaintService } from "../services/ComplaintService";

const service = new ComplaintService();

export class ComplaintController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sortField, sortOrder } = req.query;

      const result = await service.getAllComplaints({
        search: (search as string) || "",
        sortField: (sortField as string) || "description",
        sortOrder: (sortOrder as "ASC" | "DESC") || "ASC",
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const complaint = await service.createComplaint(req.body);
      res.status(201).json({ success: true, data: complaint });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await service.updateComplaint(
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
      await service.deleteComplaint(Number(req.params.id));
      res.json({ success: true, message: "Complaint deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

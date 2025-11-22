import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

const service = new ComplaintService();

export class ComplaintController {
  async getAll(req: Request, res: Response) {
    const { page, limit, search, sortField, sortOrder } = req.query;

    const result = await service.getAllComplaints({
      search: (search as string) || "",
      sortField: (sortField as string) || "description",
      sortOrder: (sortOrder as string) || "ASC",
    });

    res.json(result);
  }

  async create(req: Request, res: Response) {
    const complaint = await service.createComplaint(req.body);
    res.status(201).json(complaint);
  }

  async update(req: Request, res: Response) {
    const updated = await service.updateComplaint(Number(req.params.id), req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    await service.deleteComplaint(Number(req.params.id));
    res.json({ message: "Complaint deleted successfully" });
  }
}

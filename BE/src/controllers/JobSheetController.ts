import { Request, Response, NextFunction } from "express";
import { JobSheetService } from "../services/JobSheetService";

const service = new JobSheetService();

export class JobSheetController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        status,
        client,
        assignedTo,
        fromDate,
        toDate,
        sortField,
        sortOrder,
        page,
        limit,
      } = req.query;

      const result = await service.getAllJobs({
        search: (search as string) || "",
        status: (status as string) || "",
        client: (Number(client) as number) || null,
        assignedTo: (Number(assignedTo) as number) || null,
        fromDate: (fromDate as string) || "",
        toDate: (toDate as string) || "",
        sortField: (sortField as string) || "createdOn",
        sortOrder: (sortOrder as "ASC" | "DESC") || "DESC",
        page: (Number(page) as number) || 1,
        limit: (Number(limit) as number) || 10,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const job = await service.getJobById(Number(id));
      res.json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await service.createJob(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await service.updateJob(Number(id), req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await service.deleteJob(Number(id));
      res.json({ success: true, message: "Job sheet deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

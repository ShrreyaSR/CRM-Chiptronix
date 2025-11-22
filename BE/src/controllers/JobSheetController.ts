import { Request, Response } from "express";
import { JobSheetService } from "../services/JobSheetService";

const service = new JobSheetService();

export class JobSheetController {
  async getAll(req: Request, res: Response) {
    const result = await service.getAllJobs(req.query);
    res.json(result);
  }

  async create(req: Request, res: Response) {
    const job = await service.createJob(req.body);
    res.status(201).json(job);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await service.updateJob(Number(id), req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await service.deleteJob(Number(id));
    res.status(204).send();
  }
}

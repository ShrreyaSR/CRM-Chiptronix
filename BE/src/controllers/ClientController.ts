import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/ClientService";

const service = new ClientService();

export class ClientController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, sortField, sortOrder, clientType } = req.query;

      const result = await service.getAllClients({
        search: (search as string) || "",
        sortField: (sortField as string) || "name",
        sortOrder: (sortOrder as "ASC" | "DESC") || "ASC",
        clientType: (clientType as string) || undefined,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await service.createClient(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await service.updateClient(Number(req.params.id), req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.deleteClient(Number(req.params.id));
      res.json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response } from "express";
import { ClientService } from "../services/ClientService";

const service = new ClientService();

export class ClientController {
  async getAll(req: Request, res: Response) {
    const {search, sortField, sortOrder, clientType } = req.query;
    const result = await service.getAllClients({
      search: (search as string) || "",
      sortField: (sortField as string) || "name",
      sortOrder: (sortOrder as string) || "ASC",
      clientType: (clientType as string) || undefined,
    });
    console.log("Clients : ", result.data)
    res.json(result); 
  }

  async create(req: Request, res: Response) {
    const client = await service.createClient(req.body);
    res.status(201).json(client);
  }

  async update(req: Request, res: Response) {
    const updated = await service.updateClient(Number(req.params.id), req.body);
    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    await service.deleteClient(Number(req.params.id));
    res.json({ message: "Client deleted successfully" });
  }
}

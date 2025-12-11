import { ClientRepository } from "../repositories/ClientRepository";
import { Client } from "../entities/Client";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class ClientService {
  private repo = ClientRepository;

  async getAllClients(options: {
    search?: string;
    sortField?: string;
    sortOrder?: "ASC" | "DESC";
    clientType?: string;
  }) {
    const { search, sortField, sortOrder, clientType } = options;
    const query = this.repo.createQueryBuilder("client");

    if (search) {
      query.andWhere(
        "(client.name ILIKE :search OR client.email ILIKE :search OR client.phone ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (clientType) {
      query.andWhere("client.clientType = :clientType", { clientType });
    }

    query.orderBy(`client.${sortField}`, sortOrder);
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.repo.findOneBy({ id });
    if (!client) {
      throw new AppError(`Client with id ${id} not found`, 404);
    }
    return client;
  }

  async createClient(dto: Client) {
    const client = this.repo.create(dto);
    const saved = await this.repo.save(client);
    logger.info("Client created", { clientId: saved.id });
    return saved;
  }

  async updateClient(id: number, dto: Partial<Client>) {
    await this.getClientById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Client updated", { clientId: id });
    return updated!;
  }

  async deleteClient(id: number) {
    await this.getClientById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Client deleted", { clientId: id });
  }
}

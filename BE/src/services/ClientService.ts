import { ClientRepository } from "../repositories/ClientRepository";
import { Client } from "../entities/Client";

export class ClientService {
  private repo = ClientRepository;

  async getAllClients(options: {
    search?: string;
    sortField?: string;
    sortOrder?: string;
    clientType?: string;
  }) {
    const { search, sortField = "id", sortOrder = "ASC", clientType } = options;

    const query = this.repo
      .createQueryBuilder("client");

    if (search) {
      query.andWhere(
        "(client.name ILIKE :search OR client.email ILIKE :search OR client.phone ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (clientType) {
      query.andWhere("client.clientType = :clientType", { clientType });
    }

    query.orderBy(`client.${sortField}`, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC");
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async createClient(dto: Client) {
    return await this.repo.createClient(dto);
  }

  async updateClient(id: number, dto: Partial<Client>) {
    await this.repo.update(id, dto);
    return await this.repo.findOneBy({ id });
  }

  async deleteClient(id: number) {
    await this.repo.delete(id);
  }
}

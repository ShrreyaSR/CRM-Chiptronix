import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";

export const ClientRepository = AppDataSource.getRepository(Client).extend({
  async createClient(dto: Client) {
    const client = this.create(dto);
    return await this.save(client);
  },

  async findAll() {
    return await this.find();
  },
});

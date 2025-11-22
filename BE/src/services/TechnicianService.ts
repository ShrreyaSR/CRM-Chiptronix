import { TechnicianRepository } from "../repositories/TechnicianRepository";
import { Technician } from "../entities/Technician";

export class TechnicianService {
  private repo = TechnicianRepository;

  async getAllTechnicians(options: {
    search: string;
    sortField: string;
    sortOrder: string;
  }){
    const { search, sortField, sortOrder } = options;

    const query = this.repo
      .createQueryBuilder("technician")
      .where("technician.name ILIKE :search OR technician.email ILIKE :search OR technician.phone ILIKE :search", { search: `%${search}%` });

    query.orderBy(`technician.${sortField}`, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC");

    const [data, total] = await query.getManyAndCount();
    return { data, total};
  }

  async createTechnician(data: Technician) {
    return await this.repo.createTechnician(data);
  }

  async updateTechnician(id: number, dto: Partial<Technician>) {
    await this.repo.update(id, dto);
    return await this.repo.findOneBy({ id });
  }

  async deleteTechnician(id: number) {
    await this.repo.delete(id);
  }
}

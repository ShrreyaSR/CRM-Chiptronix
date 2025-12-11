import { TechnicianRepository } from "../repositories/TechnicianRepository";
import { Technician } from "../entities/Technician";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class TechnicianService {
  private repo = TechnicianRepository;

  async getAllTechnicians(options: {
    search: string;
    sortField: string;
    sortOrder: "ASC" | "DESC";
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("technician");

    if (search) {
      query.where(
        "technician.name ILIKE :search OR technician.email ILIKE :search OR technician.phone ILIKE :search",
        { search: `%${search}%` }
      );
    }

    query.orderBy(`technician.${sortField}`, sortOrder);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getTechnicianById(id: number): Promise<Technician> {
    const technician = await this.repo.findOneBy({ id });
    if (!technician) {
      throw new AppError(`Technician with id ${id} not found`, 404);
    }
    return technician;
  }

  async createTechnician(dto: Technician) {
    const technician = this.repo.create(dto);
    const saved = await this.repo.save(technician);
    logger.info("Technician created", { technicianId: saved.id });
    return saved;
  }

  async updateTechnician(id: number, dto: Partial<Technician>) {
    await this.getTechnicianById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Technician updated", { technicianId: id });
    return updated!;
  }

  async deleteTechnician(id: number) {
    await this.getTechnicianById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Technician deleted", { technicianId: id });
  }
}

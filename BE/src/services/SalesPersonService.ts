import { SalesPersonRepository } from "../repositories/SalesPersonRepository";
import { SalesPerson } from "../entities/SalesPerson";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class SalesPersonService {
  private repo = SalesPersonRepository;

  async getAllSalesPersons(options: {
    search: string;
    sortField: string;
    sortOrder: "ASC" | "DESC";
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("salesperson");

    if (search) {
      query.where(
        "salesperson.name ILIKE :search OR salesperson.email ILIKE :search OR salesperson.phone ILIKE :search",
        { search: `%${search}%` }
      );
    }

    query.orderBy(`salesperson.${sortField}`, sortOrder);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getSalesPersonById(id: number): Promise<SalesPerson> {
    const salesperson = await this.repo.findOneBy({ id });
    if (!salesperson) {
      throw new AppError(`Sales person with id ${id} not found`, 404);
    }
    return salesperson;
  }

  async createSalesPerson(dto: SalesPerson) {
    const salesperson = this.repo.create(dto);
    const saved = await this.repo.save(salesperson);
    logger.info("Sales person created", { salesPersonId: saved.id });
    return saved;
  }

  async updateSalesPerson(id: number, dto: Partial<SalesPerson>) {
    await this.getSalesPersonById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Sales person updated", { salesPersonId: id });
    return updated!;
  }

  async deleteSalesPerson(id: number) {
    await this.getSalesPersonById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Sales person deleted", { salesPersonId: id });
  }
}

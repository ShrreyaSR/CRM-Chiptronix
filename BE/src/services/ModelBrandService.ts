import { ModelBrandRepository } from "../repositories/ModelBrandRepository";
import { ModelBrand } from "../entities/ModelBrand";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class ModelBrandService {
  private repo = ModelBrandRepository;

  async getAll(options: {
    search: string;
    sortField: string;
    sortOrder: "ASC" | "DESC";
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("mb");

    if (search) {
      query.where("mb.model ILIKE :search OR mb.brand ILIKE :search", {
        search: `%${search}%`,
      });
    }

    query.orderBy(`mb.${sortField}`, sortOrder);
    query.addOrderBy("mb.brand", sortOrder);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async getById(id: number): Promise<ModelBrand> {
    const item = await this.repo.findOneBy({ id });
    if (!item) {
      throw new AppError(`Model/Brand with id ${id} not found`, 404);
    }
    return item;
  }

  async create(dto: ModelBrand) {
    const item = this.repo.create(dto);
    const saved = await this.repo.save(item);
    logger.info("Model/Brand created", { modelBrandId: saved.id });
    return saved;
  }

  async update(id: number, dto: Partial<ModelBrand>) {
    await this.getById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Model/Brand updated", { modelBrandId: id });
    return updated!;
  }

  async delete(id: number) {
    await this.getById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Model/Brand deleted", { modelBrandId: id });
  }
}

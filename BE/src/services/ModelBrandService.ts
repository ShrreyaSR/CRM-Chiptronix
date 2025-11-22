import { ModelBrandRepository } from "../repositories/ModelBrandRepository";
import { ModelBrand } from "../entities/ModelBrand";

export class ModelBrandService {
  private repo = ModelBrandRepository;

  async getAll(options: {
    search: string;
    sortField: string;
    sortOrder: string;
  }) {
    const { search , sortField, sortOrder } = options;


    const query = this.repo
      .createQueryBuilder("mb")
      .where("mb.model ILIKE :search OR mb.brand ILIKE :search", { search: `%${search}%` });

    query
      .orderBy(`mb.${sortField}`, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC")

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async create(dto: ModelBrand) {
    return await this.repo.createModelBrand(dto);
  }

  async update(id: number, dto: Partial<ModelBrand>) {
    await this.repo.update(id, dto);
    return await this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }
}

import { AppDataSource } from "../config/data-source";
import { ModelBrand } from "../entities/ModelBrand";

export const ModelBrandRepository = AppDataSource.getRepository(ModelBrand).extend({
  async createModelBrand(dto: ModelBrand) {
    const item = this.create(dto);
    return await this.save(item);
  },

  async findAll() {
    return await this.find();
  },
});

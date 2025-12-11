import { AppDataSource } from "../config/data-source";
import { ModelBrand } from "../entities/ModelBrand";

export const ModelBrandRepository = AppDataSource.getRepository(
  ModelBrand
).extend({});

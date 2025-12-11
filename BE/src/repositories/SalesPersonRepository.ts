import { AppDataSource } from "../config/data-source";
import { SalesPerson } from "../entities/SalesPerson";

export const SalesPersonRepository = AppDataSource.getRepository(
  SalesPerson
).extend({});

import { AppDataSource } from "../config/data-source";
import { Vendor } from "../entities/Vendor";

export const VendorRepository = AppDataSource.getRepository(Vendor).extend({});

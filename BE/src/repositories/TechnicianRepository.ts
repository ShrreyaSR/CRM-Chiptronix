import { AppDataSource } from "../config/data-source";
import { Technician } from "../entities/Technician";

export const TechnicianRepository = AppDataSource.getRepository(
  Technician
).extend({});

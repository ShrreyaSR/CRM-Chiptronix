import { AppDataSource } from "../config/data-source";
import { Complaint } from "../entities/Complaint";

export const ComplaintRepository = AppDataSource.getRepository(
  Complaint
).extend({});

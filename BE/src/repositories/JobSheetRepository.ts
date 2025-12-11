import { AppDataSource } from "../config/data-source";
import { JobSheet } from "../entities/JobSheet";

export const JobSheetRepository = AppDataSource.getRepository(JobSheet).extend(
  {}
);

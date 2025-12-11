import "reflect-metadata";
import { DataSource } from "typeorm";
import { Technician } from "../entities/Technician";
import { Client } from "../entities/Client";
import { Complaint } from "../entities/Complaint";
import { ModelBrand } from "../entities/ModelBrand";
import { Tray } from "../entities/Tray";
import { JobSheet } from "../entities/JobSheet";
import { SalesPerson } from "../entities/SalesPerson";
import { Vendor } from "../entities/Vendor";
import { Spares } from "../entities/Spares";
import { env } from "./env";
import { logger } from "../utils/logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.typeorm.synchronize,
  logging: env.typeorm.logging,
  entities: [
    Technician,
    Client,
    Complaint,
    ModelBrand,
    Tray,
    JobSheet,
    Vendor,
    SalesPerson,
    Spares
  ],
});

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected successfully", {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
    });
  } catch (error) {
    logger.error("Database connection failed", error);
    throw error;
  }
};

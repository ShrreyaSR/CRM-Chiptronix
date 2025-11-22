import "reflect-metadata";
import { DataSource } from "typeorm";
import { Technician } from "../entities/Technician";
import { Client } from "../entities/Client";
import { Complaint } from "../entities/Complaint";
import { ModelBrand } from "../entities/ModelBrand";
import { Tray } from "../entities/Tray";
import { JobSheet } from "../entities/JobSheet";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "shrreyaram",
  password: "12345678",
  database: "crm_db",
  synchronize: true,
  logging: false,
  entities: [Technician, Client, Complaint, ModelBrand, Tray, JobSheet],
});


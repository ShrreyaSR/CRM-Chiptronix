import dotenv from "dotenv";

dotenv.config();

export const env = {
  // Database
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "shrreyaram",
    password: process.env.DB_PASSWORD || "12345678",
    database: process.env.DB_DATABASE || "crm_db",
  },
  // Server
  server: {
    port: parseInt(process.env.PORT || "8080", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  // TypeORM
  typeorm: {
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" || false,
    logging: process.env.TYPEORM_LOGGING === "true" || false,
  },
} as const;


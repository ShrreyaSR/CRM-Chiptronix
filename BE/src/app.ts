import "reflect-metadata";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./config/data-source";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

// Routes
import authRoute from "./routes/AuthRoute";
import technicianRoutes from "./routes/TechnicianRoute";
import clientRoutes from "./routes/ClientRoute";
import complaintRoutes from "./routes/ComplaintRoute";
import modelBrandRoutes from "./routes/ModelBrandRoute";
import trayRoutes from "./routes/TrayRoute";
import jobSheetRoute from "./routes/JobSheetRoute";
import vendorRoute from "./routes/VendorRoute";
import salesPersonRoute from "./routes/SalesPersonRoute";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Auth routes (public)
app.use("/auth", authRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.server.nodeEnv,
  });
});

// API Routes
app.use("/technicians", technicianRoutes);
app.use("/clients", clientRoutes);
app.use("/complaints", complaintRoutes);
app.use("/model-brands", modelBrandRoutes);
app.use("/trays", trayRoutes);
app.use("/jobsheets", jobSheetRoute);
app.use("/vendor", vendorRoute);
app.use("/sales-person", salesPersonRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    
    app.listen(env.server.port, () => {
      logger.info("Server started successfully", {
        port: env.server.port,
        environment: env.server.nodeEnv,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import express from "express";
import cors from "cors";
import technicianRoutes from "./routes/TechnicianRoute";
import clientRoutes from "./routes/ClientRoute"
import complaintRoutes from "./routes/ComplaintRoute"
import modelBrandRoutes from "./routes/ModelBrandRoute";
import trayRoutes from "./routes/TrayRoute";
import jobSheetRoute from "./routes/JobSheetRoute"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/technicians", technicianRoutes);
app.use("/clients", clientRoutes);
app.use("/complaints", complaintRoutes);
app.use("/model-brands", modelBrandRoutes);
app.use("/trays", trayRoutes);
app.use("/jobsheets", jobSheetRoute)


AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected");
    app.listen(8080, () => console.log("🚀 Server running on port 8080"));
  })
  .catch((err) => console.error("DB Connection Error:", err));

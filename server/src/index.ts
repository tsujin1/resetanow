import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./shared/config/db";
import authRoutes from "./features/auth/routes/authRoutes";
import patientRoutes from "./features/patients/routes/patientRoutes";
import prescriptionRoutes from "./features/prescriptions/routes/prescriptionRoutes";
import medCertRoutes from "./features/medcert/routes/medCertRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medcerts", medCertRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
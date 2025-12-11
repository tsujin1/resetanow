import express from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getPatients)
  .post(protect, createPatient);

router.route("/:id")
  .get(protect, getPatientById)
  .put(protect, updatePatient)
  .delete(protect, deletePatient);

export default router;








import express from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientHistory,
} from "../controllers/patientController";
import { protect } from "../../../shared/middleware/authMiddleware";
import { validateObjectId } from "../../../shared/middleware/validateObjectId";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getPatients)
  .post(protect, createPatient);

router.route("/:id/history")
  .get(protect, validateObjectId("id"), getPatientHistory);

router.route("/:id")
  .get(protect, validateObjectId("id"), getPatientById)
  .put(protect, validateObjectId("id"), updatePatient)
  .delete(protect, validateObjectId("id"), deletePatient);

export default router;









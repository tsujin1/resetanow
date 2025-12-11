import express from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getPrescriptions)
  .post(protect, createPrescription);

router.route("/:id")
  .get(protect, getPrescriptionById)
  .put(protect, updatePrescription)
  .delete(protect, deletePrescription);

export default router;









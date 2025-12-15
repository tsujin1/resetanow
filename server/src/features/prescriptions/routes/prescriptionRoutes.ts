import express from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController";
import { protect } from "../../../shared/middleware/authMiddleware";
import { validateObjectId } from "../../../shared/middleware/validateObjectId";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getPrescriptions)
  .post(protect, createPrescription);

router.route("/:id")
  .get(protect, validateObjectId("id"), getPrescriptionById)
  .put(protect, validateObjectId("id"), updatePrescription)
  .delete(protect, validateObjectId("id"), deletePrescription);

export default router;









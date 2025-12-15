import express from "express";
import {
  getMedCerts,
  getMedCertById,
  createMedCert,
  updateMedCert,
  deleteMedCert,
} from "../controllers/medCertController";
import { protect } from "../../../shared/middleware/authMiddleware";
import { validateObjectId } from "../../../shared/middleware/validateObjectId";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getMedCerts)
  .post(protect, createMedCert);

router.route("/:id")
  .get(protect, validateObjectId("id"), getMedCertById)
  .put(protect, validateObjectId("id"), updateMedCert)
  .delete(protect, validateObjectId("id"), deleteMedCert);

export default router;








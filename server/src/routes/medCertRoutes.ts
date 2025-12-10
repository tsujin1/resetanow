import express from "express";
import {
  getMedCerts,
  getMedCertById,
  createMedCert,
  updateMedCert,
  deleteMedCert,
} from "../controllers/medCertController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes are protected - require authentication
router.route("/")
  .get(protect, getMedCerts)
  .post(protect, createMedCert);

router.route("/:id")
  .get(protect, getMedCertById)
  .put(protect, updateMedCert)
  .delete(protect, deleteMedCert);

export default router;



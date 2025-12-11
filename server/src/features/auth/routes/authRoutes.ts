import express from "express";
import {
  registerDoctor,
  loginDoctor,
  getProfile,
  updateProfile
} from "../controllers/authController";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
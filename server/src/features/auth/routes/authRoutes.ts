import express from "express";
import {
  registerDoctor,
  loginDoctor,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  deleteAccount
} from "../controllers/authController";
import { protect } from "../../../shared/middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);

export default router;
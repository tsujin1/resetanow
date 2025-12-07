import express from "express";
import {
  registerDoctor,
  loginDoctor,
  getProfile,     // <--- Added import
  updateProfile   // <--- Added import
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

// DEBUG LOG: Will print when server starts
console.log("✅ Auth Routes File Loaded!");

const router = express.Router();

// Matches the export names in authController.ts
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// DEBUG LOG: Will print when you hit the route
router.get("/profile", (req, res, next) => {
  console.log("🔍 Profile Route Hit!");
  next();
}, protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
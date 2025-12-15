import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Doctor } from "../models/Doctor";
import { validateAndSanitizeEmail, isValidPassword, sanitizeString } from "../../../shared/utils/validation";

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @desc    Register new doctor
// @route   POST /api/auth/register
// @access  Public
export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, password, licenseNo } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please add all required fields" });
      return;
    }

    // Validate and sanitize email
    const emailValidation = validateAndSanitizeEmail(email);
    if (!emailValidation.isValid) {
      res.status(400).json({ message: "Please provide a valid email address" });
      return;
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
      return;
    }

    // Sanitize name
    const sanitizedName = sanitizeString(name);

    const doctorExists = await Doctor.findOne({ email: emailValidation.sanitized });
    if (doctorExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      name: sanitizedName,
      email: emailValidation.sanitized,
      password: hashedPassword,
      licenseNo: licenseNo ? sanitizeString(licenseNo) : "",
    });

    if (doctor) {
      res.status(201).json({
        _id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate a doctor
// @route   POST /api/auth/login
// @access  Public
export const loginDoctor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Validate and sanitize email
    const emailValidation = validateAndSanitizeEmail(email);
    if (!emailValidation.isValid) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const doctor = await Doctor.findOne({ email: emailValidation.sanitized });

    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      res.json({
        _id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        token: generateToken(doctor.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current doctor's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById((req as any).user._id).select("-password");
    if (doctor) {
      res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        title: doctor.title,
        role: doctor.role,
        contactNumber: doctor.contactNumber,
        clinicAddress: doctor.clinicAddress,
        clinicAvailability: doctor.clinicAvailability, // <--- ADDED HERE
        licenseNo: doctor.licenseNo,
        ptrNo: doctor.ptrNo,
        s2No: doctor.s2No,
        signatureUrl: doctor.signatureUrl,
      });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById((req as any).user._id);

    if (doctor) {
      doctor.name = req.body.name || doctor.name;
      doctor.email = req.body.email || doctor.email;
      doctor.title = req.body.title || doctor.title;
      doctor.role = req.body.role || doctor.role;
      doctor.contactNumber = req.body.contactNumber || doctor.contactNumber;
      doctor.clinicAddress = req.body.clinicAddress || doctor.clinicAddress;
      doctor.clinicAvailability = req.body.clinicAvailability || doctor.clinicAvailability; // <--- ADDED HERE
      doctor.licenseNo = req.body.licenseNo || doctor.licenseNo;
      doctor.ptrNo = req.body.ptrNo || doctor.ptrNo;
      doctor.s2No = req.body.s2No || doctor.s2No;
      doctor.signatureUrl = req.body.signatureUrl !== undefined ? req.body.signatureUrl : doctor.signatureUrl;

      const updatedDoctor = await doctor.save();

      res.json({
        _id: updatedDoctor._id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        title: updatedDoctor.title,
        role: updatedDoctor.role,
        contactNumber: updatedDoctor.contactNumber,
        clinicAddress: updatedDoctor.clinicAddress,
        clinicAvailability: updatedDoctor.clinicAvailability, // <--- ADDED HERE
        licenseNo: updatedDoctor.licenseNo,
        ptrNo: updatedDoctor.ptrNo,
        s2No: updatedDoctor.s2No,
        signatureUrl: updatedDoctor.signatureUrl,
      });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      // Don't reveal if email exists for security
      res.json({ 
        message: "If that email exists, a password reset link has been sent.",
        resetToken: null // Return null so frontend doesn't send email
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    doctor.resetToken = resetToken;
    doctor.resetTokenExpiry = resetTokenExpiry;
    await doctor.save();

    // SECURITY: Do not return resetToken in response
    // Frontend should handle email sending separately
    // Token should only be accessible via secure email link
    res.json({
      message: "If that email exists, a password reset link has been sent.",
      // Note: In production, send email from server-side, don't expose token
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      res.status(400).json({ message: "Token, email, and password are required" });
      return;
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
      return;
    }

    const doctor = await Doctor.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Token not expired
    });

    if (!doctor) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    doctor.password = hashedPassword;
    doctor.resetToken = undefined;
    doctor.resetTokenExpiry = undefined;
    await doctor.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
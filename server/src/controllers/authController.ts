import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Doctor } from "../models/Doctor";

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// @desc    Register new doctor (One-time setup usually)
// @route   POST /api/auth/register
// @access  Public
export const registerDoctor = async (req: Request, res: Response) => {
  const { name, email, password, licenseNo } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please add all fields" });
    return;
  }

  // Check if doctor exists
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create doctor
  const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    licenseNo,
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
};

// @desc    Authenticate a doctor
// @route   POST /api/auth/login
// @access  Public
export const loginDoctor = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for doctor email
  const doctor = await Doctor.findOne({ email });

  if (doctor && (await bcrypt.compare(password, doctor.password))) {
    res.json({
      _id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      token: generateToken(doctor.id),
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

// @desc    Get current doctor's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user is set by the 'protect' middleware (we will add this next)
    const doctor = await Doctor.findById((req as any).user._id).select("-password");
    if (doctor) {
      res.json(doctor);
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
      doctor.licenseNo = req.body.licenseNo || doctor.licenseNo;
      doctor.ptrNo = req.body.ptrNo || doctor.ptrNo;
      doctor.s2No = req.body.s2No || doctor.s2No;
      doctor.signatureUrl = req.body.signatureUrl || doctor.signatureUrl;

      // Only update password if sent
      if (req.body.password) {
        doctor.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedDoctor = await doctor.save();

      res.json({
        _id: updatedDoctor._id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        title: updatedDoctor.title,
        // ... return other fields as needed for the frontend context
      });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
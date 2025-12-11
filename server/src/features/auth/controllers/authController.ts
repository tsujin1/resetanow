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

// @desc    Register new doctor
// @route   POST /api/auth/register
// @access  Public
export const registerDoctor = async (req: Request, res: Response) => {
  const { name, email, password, licenseNo } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please add all fields" });
    return;
  }

  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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
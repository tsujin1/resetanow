import { Request, Response } from "express";
import { Patient } from "../models/Patient";

// @desc    Get all patients for the authenticated doctor
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find({ doctor: (req as any).user._id })
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, age, gender, address, contactNumber, lastVisit } = req.body;

    // Validation
    if (!name || !age || !gender || !address || !contactNumber) {
      res.status(400).json({
        message: "Please provide all required fields: name, age, gender, address, contactNumber",
      });
      return;
    }

    if (!["Male", "Female"].includes(gender)) {
      res.status(400).json({ message: "Gender must be either 'Male' or 'Female'" });
      return;
    }

    const patient = await Patient.create({
      doctor: (req as any).user._id,
      name,
      age,
      gender,
      address,
      contactNumber,
      lastVisit: lastVisit ? new Date(lastVisit) : new Date(),
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    // Update fields
    if (req.body.name !== undefined) patient.name = req.body.name;
    if (req.body.age !== undefined) patient.age = req.body.age;
    if (req.body.gender !== undefined) {
      if (!["Male", "Female"].includes(req.body.gender)) {
        res.status(400).json({ message: "Gender must be either 'Male' or 'Female'" });
        return;
      }
      patient.gender = req.body.gender;
    }
    if (req.body.address !== undefined) patient.address = req.body.address;
    if (req.body.contactNumber !== undefined) patient.contactNumber = req.body.contactNumber;
    if (req.body.lastVisit !== undefined) {
      patient.lastVisit = new Date(req.body.lastVisit);
    }

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    await Patient.deleteOne({ _id: req.params.id });
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};




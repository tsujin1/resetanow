import { Request, Response } from "express";
import { PatientService } from "../services/patientService";

// @desc    Get all patients for the authenticated doctor
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await PatientService.getPatientsByDoctor((req as any).user._id);
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
    const patient = await PatientService.getPatientById(
      req.params.id,
      (req as any).user._id,
    );

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

    const patient = await PatientService.createPatient((req as any).user._id, {
      name,
      age,
      gender,
      address,
      contactNumber,
      lastVisit,
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
    if (req.body.gender !== undefined && !["Male", "Female"].includes(req.body.gender)) {
      res.status(400).json({ message: "Gender must be either 'Male' or 'Female'" });
      return;
    }

    const updatedPatient = await PatientService.updatePatient(
      req.params.id,
      (req as any).user._id,
      req.body,
    );

    if (!updatedPatient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

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
    const deleted = await PatientService.deletePatient(
      req.params.id,
      (req as any).user._id,
    );

    if (!deleted) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get patient history (prescriptions and medical certificates)
// @route   GET /api/patients/:id/history
// @access  Private
export const getPatientHistory = async (req: Request, res: Response) => {
  try {
    const history = await PatientService.getPatientHistory(
      req.params.id,
      (req as any).user._id,
    );
    res.json(history);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    if ((error as Error).message === "Patient not found") {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};









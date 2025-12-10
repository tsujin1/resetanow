import { Request, Response } from "express";
import { Prescription } from "../models/Prescription";
import { Patient } from "../models/Patient";

// @desc    Get all prescriptions for the authenticated doctor
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: (req as any).user._id,
    })
      .populate("patientId", "name age gender address contactNumber")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    }).populate("patientId", "name age gender address contactNumber");

    if (!prescription) {
      res.status(404).json({ message: "Prescription not found" });
      return;
    }

    res.json(prescription);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private
export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patientId, date, diagnosis, amount, medications } = req.body;

    // Validation
    if (!patientId || !date || amount === undefined || !medications) {
      res.status(400).json({
        message:
          "Please provide all required fields: patientId, date, amount, medications",
      });
      return;
    }

    if (!Array.isArray(medications) || medications.length === 0) {
      res.status(400).json({
        message: "At least one medication is required",
      });
      return;
    }

    // Validate each medication
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.instructions || !med.quantity) {
        res.status(400).json({
          message:
            "Each medication must have: name, dosage, instructions, and quantity",
        });
        return;
      }
    }

    // Verify patient belongs to the doctor
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: (req as any).user._id,
    });

    if (!patient) {
      res.status(404).json({
        message: "Patient not found or does not belong to you",
      });
      return;
    }

    const prescription = await Prescription.create({
      doctor: (req as any).user._id,
      patientId,
      date: new Date(date),
      diagnosis: diagnosis || "",
      amount,
      medications,
    });

    // Populate patient data in response
    const populatedPrescription = await Prescription.findById(
      prescription._id,
    ).populate("patientId", "name age gender address contactNumber");

    res.status(201).json(populatedPrescription);
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    });

    if (!prescription) {
      res.status(404).json({ message: "Prescription not found" });
      return;
    }

    // Update fields
    if (req.body.patientId !== undefined) {
      // Verify new patient belongs to the doctor
      const patient = await Patient.findOne({
        _id: req.body.patientId,
        doctor: (req as any).user._id,
      });

      if (!patient) {
        res.status(404).json({
          message: "Patient not found or does not belong to you",
        });
        return;
      }
      prescription.patientId = req.body.patientId;
    }
    if (req.body.date !== undefined) {
      prescription.date = new Date(req.body.date);
    }
    if (req.body.diagnosis !== undefined) {
      prescription.diagnosis = req.body.diagnosis;
    }
    if (req.body.amount !== undefined) {
      if (req.body.amount < 0) {
        res.status(400).json({ message: "Amount must be a positive number" });
        return;
      }
      prescription.amount = req.body.amount;
    }
    if (req.body.medications !== undefined) {
      if (!Array.isArray(req.body.medications) || req.body.medications.length === 0) {
        res.status(400).json({
          message: "At least one medication is required",
        });
        return;
      }

      // Validate each medication
      for (const med of req.body.medications) {
        if (!med.name || !med.dosage || !med.instructions || !med.quantity) {
          res.status(400).json({
            message:
              "Each medication must have: name, dosage, instructions, and quantity",
          });
          return;
        }
      }
      prescription.medications = req.body.medications;
    }

    const updatedPrescription = await prescription.save();

    // Populate patient data in response
    const populatedPrescription = await Prescription.findById(
      updatedPrescription._id,
    ).populate("patientId", "name age gender address contactNumber");

    res.json(populatedPrescription);
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: (req as any).user._id,
    });

    if (!prescription) {
      res.status(404).json({ message: "Prescription not found" });
      return;
    }

    await Prescription.deleteOne({ _id: req.params.id });
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};



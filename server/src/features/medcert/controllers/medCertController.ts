import { Request, Response } from "express";
import { MedCert } from "../models/MedCert";
import { Patient } from "../../patients/models/Patient";
import { PatientService } from "../../patients/services/patientService";
import { isValidObjectId, sanitizeString } from "../../../shared/utils/validation";

// @desc    Get all medical certificates for the authenticated doctor
// @route   GET /api/medcerts
// @access  Private
export const getMedCerts = async (req: Request, res: Response) => {
  try {
    const medCerts = await MedCert.find({
      doctor: (req as any).user._id,
    })
      .populate("patientId", "name age gender address contactNumber")
      .sort({ createdAt: -1 });

    res.json(medCerts);
  } catch (error) {
    console.error("Error fetching medical certificates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single medical certificate by ID
// @route   GET /api/medcerts/:id
// @access  Private
export const getMedCertById = async (req: Request, res: Response) => {
  try {
    const medCertId = req.params.id;

    if (!isValidObjectId(medCertId)) {
      res.status(400).json({ message: "Invalid medical certificate ID format" });
      return;
    }

    const medCert = await MedCert.findOne({
      _id: medCertId,
      doctor: (req as any).user._id,
    }).populate("patientId", "name age gender address contactNumber");

    if (!medCert) {
      res.status(404).json({ message: "Medical certificate not found" });
      return;
    }

    res.json(medCert);
  } catch (error) {
    console.error("Error fetching medical certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new medical certificate
// @route   POST /api/medcerts
// @access  Private
export const createMedCert = async (req: Request, res: Response) => {
  try {
    const { patientId, date, reason, diagnosis, recommendation, amount } =
      req.body;

    // Validation
    if (
      !patientId ||
      !date ||
      !reason ||
      !diagnosis ||
      !recommendation ||
      amount === undefined
    ) {
      res.status(400).json({
        message:
          "Please provide all required fields: patientId, date, reason, diagnosis, recommendation, amount",
      });
      return;
    }

    // Validate patientId format
    if (!isValidObjectId(patientId)) {
      res.status(400).json({ message: "Invalid patient ID format" });
      return;
    }

    // Validate amount
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      res.status(400).json({ message: "Amount must be a valid positive number" });
      return;
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

    const medCert = await MedCert.create({
      doctor: (req as any).user._id,
      patientId,
      date: new Date(date),
      reason: sanitizeString(reason),
      diagnosis: sanitizeString(diagnosis),
      recommendation: sanitizeString(recommendation),
      amount: amountNum,
    });

    // Update patient's lastVisit based on most recent prescription/medcert
    await PatientService.updatePatientLastVisit(patientId, (req as any).user._id);

    // Populate patient data in response
    const populatedMedCert = await MedCert.findById(medCert._id).populate(
      "patientId",
      "name age gender address contactNumber",
    );

    res.status(201).json(populatedMedCert);
  } catch (error) {
    console.error("Error creating medical certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a medical certificate
// @route   PUT /api/medcerts/:id
// @access  Private
export const updateMedCert = async (req: Request, res: Response) => {
  try {
    const medCertId = req.params.id;

    if (!isValidObjectId(medCertId)) {
      res.status(400).json({ message: "Invalid medical certificate ID format" });
      return;
    }

    const medCert = await MedCert.findOne({
      _id: medCertId,
      doctor: (req as any).user._id,
    });

    if (!medCert) {
      res.status(404).json({ message: "Medical certificate not found" });
      return;
    }

    // Update fields
    if (req.body.patientId !== undefined) {
      if (!isValidObjectId(req.body.patientId)) {
        res.status(400).json({ message: "Invalid patient ID format" });
        return;
      }
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
      medCert.patientId = req.body.patientId;
    }
    if (req.body.date !== undefined) {
      medCert.date = new Date(req.body.date);
    }
    if (req.body.reason !== undefined) {
      medCert.reason = sanitizeString(req.body.reason);
    }
    if (req.body.diagnosis !== undefined) {
      medCert.diagnosis = sanitizeString(req.body.diagnosis);
    }
    if (req.body.recommendation !== undefined) {
      medCert.recommendation = sanitizeString(req.body.recommendation);
    }
    if (req.body.amount !== undefined) {
      const amountNum = Number(req.body.amount);
      if (isNaN(amountNum) || amountNum < 0) {
        res.status(400).json({ message: "Amount must be a valid positive number" });
        return;
      }
      medCert.amount = amountNum;
    }

    const updatedMedCert = await medCert.save();

    // Update patient's lastVisit based on most recent prescription/medcert
    await PatientService.updatePatientLastVisit(
      updatedMedCert.patientId.toString(),
      (req as any).user._id,
    );

    // Populate patient data in response
    const populatedMedCert = await MedCert.findById(updatedMedCert._id).populate(
      "patientId",
      "name age gender address contactNumber",
    );

    res.json(populatedMedCert);
  } catch (error) {
    console.error("Error updating medical certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a medical certificate
// @route   DELETE /api/medcerts/:id
// @access  Private
export const deleteMedCert = async (req: Request, res: Response) => {
  try {
    const medCertId = req.params.id;

    if (!isValidObjectId(medCertId)) {
      res.status(400).json({ message: "Invalid medical certificate ID format" });
      return;
    }

    const medCert = await MedCert.findOne({
      _id: medCertId,
      doctor: (req as any).user._id,
    });

    if (!medCert) {
      res.status(404).json({ message: "Medical certificate not found" });
      return;
    }

    const patientId = medCert.patientId.toString();
    await MedCert.deleteOne({ _id: medCertId });

    // Update patient's lastVisit based on most recent prescription/medcert
    await PatientService.updatePatientLastVisit(patientId, (req as any).user._id);

    res.json({ message: "Medical certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
};








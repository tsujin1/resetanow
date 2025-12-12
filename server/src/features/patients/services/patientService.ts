import { Patient } from "../models/Patient";
import { Prescription } from "../../prescriptions/models/Prescription";
import { MedCert } from "../../medcert/models/MedCert";
import type { Types } from "mongoose";

interface PatientHistoryResult {
  patient: any;
  prescriptions: any[];
  medCerts: any[];
}

export class PatientService {
  /**
   * Get all patients for a doctor
   */
  static async getPatientsByDoctor(doctorId: Types.ObjectId) {
    return await Patient.find({ doctor: doctorId }).sort({ createdAt: -1 });
  }

  /**
   * Get a single patient by ID and doctor
   */
  static async getPatientById(patientId: string, doctorId: Types.ObjectId) {
    return await Patient.findOne({
      _id: patientId,
      doctor: doctorId,
    });
  }

  /**
   * Create a new patient
   */
  static async createPatient(doctorId: Types.ObjectId, patientData: any) {
    return await Patient.create({
      doctor: doctorId,
      ...patientData,
      lastVisit: patientData.lastVisit ? new Date(patientData.lastVisit) : new Date(),
    });
  }

  /**
   * Update a patient
   */
  static async updatePatient(patientId: string, doctorId: Types.ObjectId, updateData: any) {
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: doctorId,
    });

    if (!patient) {
      return null;
    }

    // Update fields
    if (updateData.name !== undefined) patient.name = updateData.name;
    if (updateData.age !== undefined) patient.age = updateData.age;
    if (updateData.gender !== undefined) patient.gender = updateData.gender;
    if (updateData.address !== undefined) patient.address = updateData.address;
    if (updateData.contactNumber !== undefined) patient.contactNumber = updateData.contactNumber;
    if (updateData.lastVisit !== undefined) {
      patient.lastVisit = new Date(updateData.lastVisit);
    }

    return await patient.save();
  }

  /**
   * Delete a patient
   */
  static async deletePatient(patientId: string, doctorId: Types.ObjectId) {
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: doctorId,
    });

    if (!patient) {
      return false;
    }

    await Patient.deleteOne({ _id: patientId });
    return true;
  }

  /**
   * Update patient's lastVisit based on most recent prescription or medcert date
   */
  static async updatePatientLastVisit(patientId: string, doctorId: Types.ObjectId) {
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: doctorId,
    });

    if (!patient) {
      return;
    }

    // Find most recent prescription date
    const latestPrescription = await Prescription.findOne({
      patientId: patientId,
      doctor: doctorId,
    })
      .sort({ date: -1 })
      .select("date");

    // Find most recent medcert date
    const latestMedCert = await MedCert.findOne({
      patientId: patientId,
      doctor: doctorId,
    })
      .sort({ date: -1 })
      .select("date");

    // Determine the most recent date
    let mostRecentDate: Date | null = null;

    if (latestPrescription && latestMedCert) {
      mostRecentDate = latestPrescription.date > latestMedCert.date 
        ? latestPrescription.date 
        : latestMedCert.date;
    } else if (latestPrescription) {
      mostRecentDate = latestPrescription.date;
    } else if (latestMedCert) {
      mostRecentDate = latestMedCert.date;
    }

    // Update patient's lastVisit if we found a date
    if (mostRecentDate) {
      patient.lastVisit = mostRecentDate;
      await patient.save();
    }
  }

  /**
   * Get patient history (prescriptions and medical certificates)
   */
  static async getPatientHistory(patientId: string, doctorId: Types.ObjectId): Promise<PatientHistoryResult> {
    const patient = await Patient.findOne({
      _id: patientId,
      doctor: doctorId,
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Fetch prescriptions and med certs for this patient
    const prescriptions = await Prescription.find({
      patientId: patientId,
      doctor: doctorId,
    }).sort({ date: -1 });

    const medCerts = await MedCert.find({
      patientId: patientId,
      doctor: doctorId,
    }).sort({ date: -1 });

    return {
      patient,
      prescriptions,
      medCerts,
    };
  }
}


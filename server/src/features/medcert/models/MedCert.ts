import mongoose from "mongoose";

const MedCertSchema = new mongoose.Schema({
  // Reference to the doctor who created this medical certificate
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  // Reference to the patient
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: [true, "Patient is required"],
  },

  // Medical certificate details
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  reason: {
    type: String,
    required: [true, "Reason for consultation is required"],
    trim: true,
  },
  diagnosis: {
    type: String,
    required: [true, "Diagnosis is required"],
    trim: true,
  },
  recommendation: {
    type: String,
    required: [true, "Recommendation is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
}, { timestamps: true });

// Index for faster queries
MedCertSchema.index({ doctor: 1, date: -1 });
MedCertSchema.index({ patientId: 1 });

export const MedCert = mongoose.model("MedCert", MedCertSchema);








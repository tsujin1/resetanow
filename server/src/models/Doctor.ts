import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  // Auth Fields
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile Fields
  name: { type: String, required: true },
  title: { type: String, default: "" },
  role: { type: String, default: "General Physician" },
  contactNumber: { type: String, default: "" },
  clinicAddress: { type: String, default: "" },

  // Legal Details
  licenseNo: { type: String, default: "" },
  ptrNo: { type: String, default: "" },
  s2No: { type: String, default: "" },

  // Branding
  signatureUrl: { type: String, default: "" },
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", DoctorSchema);
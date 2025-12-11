import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  // Auth Fields
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, required: false },
  resetTokenExpiry: { type: Date, required: false },

  // Profile Fields
  name: { type: String, required: true },
  title: { type: String, default: "" },
  role: { type: String, default: "General Physician" },
  contactNumber: { type: String, default: "" },

  // Clinic Details
  clinicAddress: { type: String, default: "" },
  clinicAvailability: { type: String, default: "" }, // <--- ADDED HERE

  // Legal Details
  licenseNo: { type: String, default: "" },
  ptrNo: { type: String, default: "" },
  s2No: { type: String, default: "" },

  // Branding
  signatureUrl: { type: String, default: "" },
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", DoctorSchema);
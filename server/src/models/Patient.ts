import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  // Reference to the doctor who owns this patient
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  // Patient Information
  name: {
    type: String,
    required: [true, "Please add a patient name"],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, "Please add patient age"],
    min: [0, "Age must be a positive number"],
  },
  gender: {
    type: String,
    required: [true, "Please select patient gender"],
    enum: ["Male", "Female"],
  },
  address: {
    type: String,
    required: [true, "Please add patient address"],
    trim: true,
  },
  contactNumber: {
    type: String,
    required: [true, "Please add contact number"],
    trim: true,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster queries
PatientSchema.index({ doctor: 1, name: 1 });

export const Patient = mongoose.model("Patient", PatientSchema);








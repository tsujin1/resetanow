import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Medicine name is required"],
    trim: true,
  },
  dosage: {
    type: String,
    required: [true, "Dosage is required"],
    trim: true,
  },
  instructions: {
    type: String,
    required: [true, "Instructions are required"],
    trim: true,
  },
  quantity: {
    type: String,
    required: [true, "Quantity is required"],
    trim: true,
  },
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema({
  // Reference to the doctor who created this prescription
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

  // Prescription details
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  diagnosis: {
    type: String,
    trim: true,
    default: "",
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
  medications: {
    type: [MedicationSchema],
    required: [true, "At least one medication is required"],
    validate: {
      validator: (v: typeof MedicationSchema[]) => v.length > 0,
      message: "At least one medication is required",
    },
  },
}, { timestamps: true });

// Index for faster queries
PrescriptionSchema.index({ doctor: 1, date: -1 });
PrescriptionSchema.index({ patientId: 1 });

export const Prescription = mongoose.model("Prescription", PrescriptionSchema);



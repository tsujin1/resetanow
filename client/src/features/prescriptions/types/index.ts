import type { IPatient } from "@/features/patients/types";

export interface IPrescription {
  _id: string;
  patientId: string | IPatient; // Can be ID or populated object
  date: string;
  diagnosis?: string;
  amount: number; // For billing dashboard
  medications: {
    name: string;
    dosage: string; // Added (e.g. "500mg")
    instructions: string; // (e.g. "1 tab BID")
    quantity: string; // (e.g. "#30")
  }[];
  createdAt?: string;
}

import type { IPatient } from "@/features/patients/types";

export interface IMedCert {
  _id: string;
  patientId: string | IPatient;
  date: string;
  reason: string;
  diagnosis: string;
  recommendation: string;
  amount: number; // For billing dashboard
  createdAt?: string;
}

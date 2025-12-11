// Shared types used across multiple features
import type { IPatient } from "@/features/patients/types";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

// Re-export commonly used types for convenience
export type { IPatient, IPrescription, IMedCert };

// Dashboard stats (uses multiple feature types)
export interface IDashboardStats {
  totalPatients: number;
  totalRx: number;
  totalMedCerts: number;
  totalRevenue: number;
  monthlyRevenue: {
    name: string; // "Jan", "Feb"
    revenue: number;
  }[];
}


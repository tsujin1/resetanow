// --- 1. DOCTOR / SETTINGS ---
// Matches your Settings.tsx form
export interface IDoctor {
  _id?: string; // Optional because it might not exist before first save
  name: string;
  title: string;       // e.g. "MD, RMT"
  role: string;        // e.g. "General Physician" (Mapped to 'specialty' in UI)
  email: string;
  contactNumber: string;
  clinicAddress: string;
  licenseNo: string;
  ptrNo: string;
  s2No?: string;       // Optional
  signatureUrl?: string | null;
}

// --- 2. PATIENTS ---
// Matches your Patients.tsx and data needed for Rx/MedCert
export interface IPatient {
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  address: string;     // Added this (needed for Rx/MedCert templates)
  contactNumber: string;
  lastVisit: string;   // ISO Date string
}

// --- 3. PRESCRIPTIONS ---
// Matches your CreateRx.tsx form
export interface IPrescription {
  _id: string;
  patientId: string | IPatient; // Can be ID or populated object
  date: string;
  diagnosis?: string;
  amount: number;      // For billing dashboard
  medications: {
    name: string;
    dosage: string;    // Added (e.g. "500mg")
    instructions: string; // (e.g. "1 tab BID")
    quantity: string;  // (e.g. "#30")
  }[];
  createdAt?: string;
}

// --- 4. MEDICAL CERTIFICATES ---
// Matches your CreateMedCert.tsx form
export interface IMedCert {
  _id: string;
  patientId: string | IPatient;
  date: string;
  reason: string;
  diagnosis: string;
  recommendation: string;
  amount: number;      // For billing dashboard
  createdAt?: string;
}

// --- 5. DASHBOARD STATS (Optional but helpful) ---
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
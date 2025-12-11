export interface IDoctor {
  _id?: string; // Optional because it might not exist before first save
  name: string;
  title: string; // e.g. "MD, RMT"
  role: string; // e.g. "General Physician" (Mapped to 'specialty' in UI)
  email: string;
  contactNumber: string;
  clinicAddress: string;
  clinicAvailability: string;
  licenseNo: string;
  ptrNo: string;
  s2No?: string; // Optional
  signatureUrl?: string | null;
}


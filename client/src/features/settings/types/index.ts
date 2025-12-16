export interface IDoctor {
  _id?: string;
  name: string;
  title: string;
  role: string;
  email: string;
  contactNumber: string;
  clinicAddress: string;
  clinicAvailability: string;
  licenseNo: string;
  ptrNo: string;
  s2No?: string; // Optional
  signatureUrl?: string | null;
}

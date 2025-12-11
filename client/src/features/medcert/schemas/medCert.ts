import { z } from "zod";

export const medCertSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  date: z.string(),
  reason: z.string().min(1, "Reason is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  recommendation: z.string().min(1, "Recommendation is required"),
  // CHANGED: Removed z.coerce. Your UI handles the number conversion.
  amount: z.number().min(0, "Amount is required"),
});

export type MedCertValues = z.infer<typeof medCertSchema>;

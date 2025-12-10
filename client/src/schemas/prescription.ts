import { z } from "zod";

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  diagnosis: z.string().optional(),
  date: z.string(),
  // CHANGE: Removed z.coerce. We handle conversion in the UI.
  amount: z.number().min(0, "Amount is required"),
  medications: z
    .array(
      z.object({
        name: z.string().min(1, "Required"),
        dosage: z.string().min(1, "Required"),
        instructions: z.string().min(1, "Required"),
        quantity: z.string().min(1, "Required"),
      }),
    )
    .min(1, "At least one medicine is required"),
});

export type PrescriptionValues = z.infer<typeof prescriptionSchema>;

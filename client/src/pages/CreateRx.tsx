import { useRef, useState, useEffect, useContext } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  type SubmitHandler,
  type Control,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { RxTemplate } from "@/components/features/template/RxTemplate";
import { AuthContext } from "@/context/AuthContext";
import patientService from "@/services/patientService";
import prescriptionService from "@/services/prescriptionService";
import RxHeader from "@/components/features/prescriptions/RxHeader";
import PatientSelectionCard from "@/components/features/prescriptions/PatientSelectionCard";
import MedicationsCard from "@/components/features/prescriptions/MedicationsCard";
import RxDetailsCard from "@/components/features/prescriptions/RxDetailsCard";
import BillingCard from "@/components/features/prescriptions/BillingCard";
import RxActionButtons from "@/components/features/prescriptions/RxActionButtons";
import type { IPatient } from "@/types";

// --- 1. SCHEMA ---
const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  diagnosis: z.string().optional(),
  date: z.string(),
  amount: z.coerce.number().min(0, "Amount is required"),
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

type PrescriptionValues = z.infer<typeof prescriptionSchema>;

// Export the type for use in child components
export type { PrescriptionValues };

export default function CreateRx() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext) || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      amount: 0,
      patientId: "",
      medications: [{ name: "", dosage: "", instructions: "", quantity: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const data = await patientService.getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const values = useWatch({ control: form.control });
  const selectedPatient = patients.find((p) => p._id === values.patientId);

  // --- 4. PDF GENERATION ---
  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    if (!element) return;

    setIsGenerating(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Half Letter Size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [139.7, 215.9],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rx_${selectedPatient?.name || "Unknown"}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit: SubmitHandler<PrescriptionValues> = async (data) => {
    try {
      setIsSaving(true);
      toast.dismiss();

      await prescriptionService.createPrescription({
        patientId: data.patientId,
        date: data.date,
        diagnosis: data.diagnosis || undefined,
        amount: data.amount,
        medications: data.medications,
      });

      // Show success toast
      toast.success("Prescription saved", {
        description: "The prescription was successfully saved.",
      });

      // Reset form after successful save
      form.reset({
        date: new Date().toISOString().split("T")[0],
        diagnosis: "",
        amount: 0,
        medications: [{ name: "", dosage: "", instructions: "", quantity: "" }],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save prescription";
      console.error("Error saving prescription:", err);

      // Show error toast
      toast.error("Failed to save prescription", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <RxHeader
        onDownloadPdf={handleDownloadPdf}
        onSave={form.handleSubmit(onSubmit)}
        isGenerating={isGenerating}
        isSaving={isSaving}
      />

      {/* --- FORM AREA --- */}
      <div className="no-print">
        <Form {...form}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN (Patient & Meds) */}
            <div className="space-y-6 lg:col-span-2">
              <PatientSelectionCard
                control={form.control as unknown as Control<PrescriptionValues>}
                patients={patients}
                isLoadingPatients={isLoadingPatients}
                selectedPatient={selectedPatient}
              />

              <MedicationsCard
                // Fix 2: Cast the control
                control={form.control as unknown as Control<PrescriptionValues>}
                fields={fields}
                onAdd={() =>
                  append({
                    name: "",
                    dosage: "",
                    instructions: "",
                    quantity: "",
                  })
                }
                onRemove={remove}
              />
            </div>

            {/* RIGHT COLUMN (Rx Details & Billing) */}
            <div className="space-y-6">
              {/* Fix 3: Cast the control */}
              <RxDetailsCard
                control={form.control as unknown as Control<PrescriptionValues>}
              />

              <BillingCard
                // Fix 4: Cast the control
                control={form.control as unknown as Control<PrescriptionValues>}
                amount={Number(values.amount) || 0}
              />
            </div>
          </div>
        </Form>
        <RxActionButtons
          onDownloadPdf={handleDownloadPdf}
          onSave={form.handleSubmit(onSubmit)}
          isGenerating={isGenerating}
          isSaving={isSaving}
        />
      </div>

      {/* --- HIDDEN PRINT TEMPLATE --- */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "#ffffff",
        }}
      >
        <RxTemplate
          ref={componentRef}
          data={{
            patientName: selectedPatient?.name,
            age: selectedPatient?.age,
            sex: selectedPatient?.gender,
            address: selectedPatient?.address,
            date: values.date || "",
            diagnosis: values.diagnosis,
            medications: (values.medications || []).map((m) => ({
              name: m.name || "",
              dosage: m.dosage || "",
              instructions: m.instructions || "",
              quantity: m.quantity || "",
            })),
          }}
          doctor={{
            name: user?.name || "",
            title: user?.title || "",
            specialty: user?.role || "",
            licenseNo: user?.licenseNo || "",
            ptrNo: user?.ptrNo || "",
          }}
        />
      </div>
    </div>
  );
}

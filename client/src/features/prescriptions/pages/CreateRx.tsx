import { useRef, useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useForm,
  useFieldArray,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { AuthContext } from "@/shared/context/AuthContext";
import patientService from "@/features/patients/services/patientService";
import prescriptionService from "@/features/prescriptions/services/prescriptionService";
import type { IPatient } from "@/features/patients/types";

// --- IMPORT SHARED SCHEMA ---
import {
  prescriptionSchema,
  type PrescriptionValues,
} from "@/features/prescriptions/schemas/prescription";

// --- IMPORT FEATURES ---
import RxHeader from "@/features/prescriptions/components/RxHeader";
import RxActionButtons from "@/features/prescriptions/components/RxActionButtons";
import PatientSelectionCard from "@/features/prescriptions/components/PatientSelectionCard";
import MedicationsCard from "@/features/prescriptions/components/MedicationsCard";
import RxDetailsCard from "@/features/prescriptions/components/RxDetailsCard";
import BillingCard from "@/features/prescriptions/components/BillingCard";
import { RxTemplate } from "@/shared/templates/RxTemplate";

export default function CreateRx() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext) || {};

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // URL Params
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const patientName = searchParams.get("patientName");

  // Form Setup
  const form = useForm<PrescriptionValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      amount: 0,
      patientId: patientId || "",
      medications: [{ name: "", dosage: "", instructions: "", quantity: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  // Watch values for logic
  const values = useWatch({ control: form.control });
  const selectedPatient = patients.find((p) => p._id === values.patientId);

  // Track when user data is loaded
  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoaded(true);
    }
  }, [user]);

  // Logic: Disable download if no patient is selected
  const canDownload = !!selectedPatient && !isLoadingPatients && isUserLoaded;

  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const data = await patientService.getPatients();
        setPatients(data);

        // Handle URL pre-fill
        if (patientId) {
          const patient = data.find((p) => p._id === patientId);
          if (patient) {
            form.setValue("patientId", patientId);
          } else if (patientName) {
            form.setValue("patientId", patientId);
          }
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        toast.error("Failed to load patients");
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [form, patientId, patientName]);

  // PDF Generation
  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    if (!element || !selectedPatient || !isUserLoaded) return;

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
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Handler
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

      toast.success("Prescription saved", {
        description: "The prescription was successfully saved.",
      });

      form.reset({
        date: new Date().toISOString().split("T")[0],
        diagnosis: "",
        amount: 0,
        patientId: "",
        medications: [{ name: "", dosage: "", instructions: "", quantity: "" }],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save prescription";
      console.error("Error saving prescription:", err);
      toast.error("Failed to save", { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  // Safe doctor data with fallbacks - UPDATED to match RxTemplate requirements
  // Note: Using 'role' as 'specialty' since the error indicates RxTemplate expects 'specialty'
  const safeDoctorData = {
    name: user?.name || "",
    title: user?.title || "",
    specialty: user?.role || "", // Changed from 'role' to 'specialty' to match RxTemplate type
    licenseNo: user?.licenseNo || "",
    ptrNo: user?.ptrNo || "",
    s2No: user?.s2No || "",
    signatureUrl: user?.signatureUrl || "",
    clinicAddress: user?.clinicAddress || "",
    contactNumber: user?.contactNumber || "",
    clinicAvailability: user?.clinicAvailability || "",
  };

  // Safe patient data with fallbacks
  const safePatientData = {
    patientName: selectedPatient?.name || "",
    age: selectedPatient?.age || "",
    sex: selectedPatient?.gender || "",
    address: selectedPatient?.address || "",
    date: values.date || "",
    diagnosis: values.diagnosis || "",
    medications: (values.medications || []).map((m) => ({
      name: m.name || "",
      dosage: m.dosage || "",
      instructions: m.instructions || "",
      quantity: m.quantity || "",
    })),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <RxHeader
        onDownloadPdf={handleDownloadPdf}
        onSave={form.handleSubmit(onSubmit)}
        isGenerating={isGenerating}
        isSaving={isSaving}
        disableDownload={!canDownload}
      />

      {/* FORM AREA */}
      <div className="no-print">
        <Form {...form}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              <PatientSelectionCard
                control={form.control}
                patients={patients}
                isLoadingPatients={isLoadingPatients}
                selectedPatient={selectedPatient}
              />

              <MedicationsCard
                control={form.control}
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

            {/* Right Column */}
            <div className="space-y-6">
              <RxDetailsCard control={form.control} />

              <BillingCard
                control={form.control}
                amount={Number(values.amount) || 0}
              />
            </div>
          </div>
        </Form>

        {/* Mobile Action Buttons */}
        <RxActionButtons
          onDownloadPdf={handleDownloadPdf}
          onSave={form.handleSubmit(onSubmit)}
          isGenerating={isGenerating}
          isSaving={isSaving}
          disableDownload={!canDownload}
        />
      </div>

      {/* OFF-SCREEN TEMPLATE */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "#ffffff",
        }}
      >
        {isUserLoaded && (
          <RxTemplate
            ref={componentRef}
            data={safePatientData}
            doctor={safeDoctorData}
          />
        )}
      </div>
    </div>
  );
}

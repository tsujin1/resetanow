import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/shared/context/AuthContext";
import patientService from "@/features/patients/services/patientService";
import medCertService from "@/features/medcert/services/medCertService";
import type { IPatient } from "@/features/patients/types";

// Import schema and type
import {
  medCertSchema,
  type MedCertValues,
} from "@/features/medcert/schemas/medCert";

// Import components
import { PatientInfoCard } from "@/features/medcert/components/PatientInfoCard";
import { ClinicalInfoCard } from "@/features/medcert/components/ClinicalCard";
import { BillingInfoCard } from "@/features/medcert/components/BillingCard";
import MedCertHeader from "@/features/medcert/components/MedCertHeader";
import MedCertActionButtons from "@/features/medcert/components/MedCertActionButtons";
import { MedCertTemplate } from "@/shared/templates/MedCertTemplate";

export default function CreateMedCert() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext) || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const patientName = searchParams.get("patientName");

  const form = useForm<MedCertValues>({
    resolver: zodResolver(medCertSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      reason: "",
      diagnosis: "",
      recommendation: "",
      amount: 0,
      patientId: patientId || "",
    },
  });

  const values = useWatch({ control: form.control });
  const selectedPatient = patients.find((p) => p._id === values.patientId);

  // Logic to determine if download is allowed
  const canDownload = !!selectedPatient && !isLoadingPatients;

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoadingPatients(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);

      if (patientId) {
        const patient = data.find((p) => p._id === patientId);
        if (patient) {
          form.setValue("patientId", patientId);
        } else if (patientName) {
          form.setValue("patientId", patientId);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load patients";
      console.error("Error fetching patients:", err);
      toast.error("Failed to load patients", { description: errorMessage });
    } finally {
      setIsLoadingPatients(false);
    }
  }, [patientId, patientName, form]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchPatients();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchPatients]);

  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    if (!element) return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MedCert_${selectedPatient?.name || "Unknown"}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit: SubmitHandler<MedCertValues> = async (data) => {
    try {
      setIsSaving(true);
      toast.dismiss();
      await medCertService.createMedCert(data);
      toast.success("Medical certificate saved", {
        description: "The medical certificate was successfully saved.",
      });
      form.reset({
        date: new Date().toISOString().split("T")[0],
        reason: "",
        diagnosis: "",
        recommendation: "",
        amount: 0,
        patientId: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save";
      console.error("Error saving:", err);
      toast.error("Failed to save", { description: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* HEADER COMPONENT */}
      <MedCertHeader
        onDownloadPdf={handleDownloadPdf}
        onSave={form.handleSubmit(onSubmit)}
        isGenerating={isGenerating}
        isSaving={isSaving}
        disableDownload={!canDownload}
      />

      {/* MAIN FORM LAYOUT */}
      <div className="no-print">
        <Form {...form}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-2">
              <PatientInfoCard
                control={form.control}
                patients={patients}
                isLoading={isLoadingPatients}
                selectedPatient={selectedPatient}
              />
              <ClinicalInfoCard control={form.control} />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <BillingInfoCard
                control={form.control}
                totalAmount={values.amount || 0}
              />
            </div>
          </div>
        </Form>

        {/* MOBILE ACTION BUTTONS COMPONENT */}
        <MedCertActionButtons
          onDownloadPdf={handleDownloadPdf}
          onSave={form.handleSubmit(onSubmit)}
          isGenerating={isGenerating}
          isSaving={isSaving}
          disableDownload={!canDownload}
        />
      </div>

      {/* OFF-SCREEN TEMPLATE */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {!isLoadingPatients && (
          <MedCertTemplate
            ref={componentRef}
            data={{
              patientName: selectedPatient?.name,
              age: selectedPatient?.age,
              sex: selectedPatient?.gender,
              address: selectedPatient?.address,
              date: values.date || "",
              reason: values.reason || "",
              diagnosis: values.diagnosis || "",
              recommendation: values.recommendation || "",
            }}
            doctor={{
              name: user?.name || "",
              title: user?.title || "",
              specialty: user?.role || "General Physician",
              contactNumber: user?.contactNumber || "",
              email: user?.email || "",
              licenseNo: user?.licenseNo || "",
              ptrNo: user?.ptrNo || "",
              signatureUrl: user?.signatureUrl || null,
            }}
          />
        )}
      </div>
    </div>
  );
}

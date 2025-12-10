// pages/CreateMedCert.tsx
import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, FileBadge, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/context/AuthContext";
import patientService from "@/services/patientService";
import medCertService from "@/services/medCertService";
import type { IPatient } from "@/types";

// Import schema and type
import { medCertSchema, type MedCertValues } from "@/schemas/medCert";

import { PatientInfoCard } from "@/components/features/medcert/PatientInfoCard";
import { ClinicalInfoCard } from "@/components/features/medcert/ClinicalInfoCard";
import { BillingInfoCard } from "@/components/features/medcert/BillingInfoCard";
import { MedCertTemplate } from "../components/features/template/MedCertTemplate";

export default function CreateMedCert() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext) || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MedCertValues>({
    resolver: zodResolver(medCertSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      reason: "",
      diagnosis: "",
      recommendation: "",
      amount: 0,
      patientId: "",
    },
  });

  const values = useWatch({ control: form.control });
  const selectedPatient = patients.find((p) => p._id === values.patientId);

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoadingPatients(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load patients";
      console.error("Error fetching patients:", err);
      toast.error("Failed to load patients", { description: errorMessage });
    } finally {
      setIsLoadingPatients(false);
    }
  }, []);

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

  // Explicitly typed SubmitHandler
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

      {/* HEADER AREA */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <FileBadge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Medical Certificate
              </h1>
              <p className="text-sm text-slate-600">
                Generate and manage patient certification documents
              </p>
            </div>
          </div>
        </div>
        {/* Desktop Actions */}
        <div className="hidden sm:flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isGenerating || isLoadingPatients || !selectedPatient}
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </>
            )}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Record
              </>
            )}
          </Button>
        </div>
      </div>

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
                // FIX: Fallback to 0 if undefined to satisfy stricter TS type
                totalAmount={values.amount || 0}
              />
            </div>
          </div>
        </Form>

        {/* MOBILE ACTIONS */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:hidden pb-10">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isGenerating || isLoadingPatients || !selectedPatient}
            className="w-full"
          >
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </>
            )}
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Record
              </>
            )}
          </Button>
        </div>
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

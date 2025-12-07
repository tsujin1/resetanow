import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, FileBadge, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MedCertTemplate } from "../components/features/rx/MedCertTemplate";

// 1. Schema
const medCertSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  date: z.string(),
  reason: z.string().min(1, "Reason is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  recommendation: z.string().min(1, "Recommendation is required"),
  amount: z.coerce.number().min(0, "Amount is required"),
});

type MedCertValues = z.infer<typeof medCertSchema>;

const dummyPatients = [
  { id: "1", name: "Jimuel Ronald Dimaandal", age: 21, sex: "Male", address: "Dr. Pilapit Street, Pasig City" },
  { id: "2", name: "Maria Clara", age: 28, sex: "Female", address: "456 Mabini Ave, Quezon City" },
  { id: "3", name: "Jose Rizal", age: 32, sex: "Male", address: "789 Kalaw Dr, Laguna" },
];

export default function CreateMedCert() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
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
  const selectedPatient = dummyPatients.find(p => p.id === values.patientId);

  const handleDownloadPdf = async () => {
    const element = componentRef.current;

    // Safety check
    if (!element) {
      return;
    }

    setIsGenerating(true);
    
    // 1. DYNAMIC IMPORT CHANGE: We now import 'html2canvas-pro'
    // Note: html2pdf.js uses html2canvas internally. 
    // However, html2pdf.js allows us to pass a custom html2canvas instance if needed,
    // OR we can use html2canvas-pro directly if we just want an image, 
    // BUT since we want a PDF, we actually need to patch html2pdf's dependency or use a different approach.
    
    // WAIT: html2pdf.js bundles its own old version of html2canvas. 
    // Simply installing html2canvas-pro won't fix 'html2pdf.js' automatically unless we configure it.
    
    // BETTER APPROACH: 
    // We will use 'html2canvas-pro' to take the picture, and then 'jspdf' to make the PDF.
    // This removes the 'html2pdf.js' dependency entirely, which is the root cause of the outdated engine.
    
    try {
        const html2canvas = (await import('html2canvas-pro')).default;
        const { jsPDF } = await import('jspdf');

        // 2. Capture the element using the modern engine
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: true,
            // We can still set a background color just to be safe for printing
            backgroundColor: "#ffffff" 
        });

        // 3. Create PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        
        // A4 dimensions in mm
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`MedCert_${selectedPatient?.name || 'Unknown'}.pdf`);

    } catch (error) {
        console.error("PDF Generation failed:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  function onSubmit(data: MedCertValues) {
    console.log("Saving Med Cert...", data);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
                <FileBadge className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Certificate</h1>
                <p className="text-sm text-slate-600">Generate and manage patient certification documents</p>
              </div>
            </div>
          </div>
          {/* ACTION BUTTONS - Hidden on mobile (hidden), Visible on desktop (sm:flex) */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownloadPdf} disabled={isGenerating}>
              {isGenerating ? (
                 <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </>
              )}
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Save className="mr-2 h-4 w-4" /> Save Record
            </Button>
          </div>
        </div>
      </div>

      {/* FORM AREA */}
      <div className="no-print">
        <Form {...form}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Patient Information</CardTitle>
                  <CardDescription className="text-sm">Select patient and consultation date</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-slate-700">Patient Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select a patient..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dummyPatients.map((p) => (
                                <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-xs text-slate-500 text-left">{p.age} yrs • {p.sex}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-slate-700">Consultation Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedPatient && (
                    <div className="mt-5 rounded-md border border-slate-200 bg-slate-50/50 p-4">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <span className="font-medium text-slate-700">Age:</span>
                          <span className="ml-2 text-slate-600">{selectedPatient.age} years old</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Sex:</span>
                          <span className="ml-2 text-slate-600">{selectedPatient.sex}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium text-slate-700">Address:</span>
                          <span className="ml-2 text-slate-600">{selectedPatient.address}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Clinical Information</CardTitle>
                  <CardDescription className="text-sm">Document consultation findings and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-slate-700">Reason for Consultation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Annual physical examination" {...field} className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diagnosis"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-slate-700">Assessment / Diagnosis</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[120px] resize-none" placeholder="Enter findings..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recommendation"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-slate-700">Medical Recommendation</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[120px] resize-none" placeholder="Enter recommendation..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Billing Information</CardTitle>
                  <CardDescription className="text-sm">Consultation fee details</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Consultation Fee</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₱</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field}
                              value={field.value as number}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              className="h-10 pl-8"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">₱{Number(values.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                      <span className="font-semibold text-slate-900">Total Amount</span>
                      <span className="text-lg font-bold text-slate-900">₱{Number(values.amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Form>
        {/* MOBILE ACTION BUTTONS - Static (Standard Flow) */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:hidden pb-10">
          <Button variant="outline" onClick={handleDownloadPdf} disabled={isGenerating} className="w-full">
            {isGenerating ? (
                <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </>
            )}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} className="w-full" size="lg">
            <Save className="mr-2 h-4 w-4" /> Save Record
          </Button>
        </div>

      </div> {/* This closes <div className="no-print"> */}

      {/* OFF-SCREEN RENDER AREA 
        FIX #2: Added explicit backgroundColor here as a safety net 
      */}
      <div 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: "-9999px",
          backgroundColor: "#ffffff"
        }}
      >
        <MedCertTemplate 
          ref={componentRef} 
          data={{
            patientName: selectedPatient?.name,
            age: selectedPatient?.age,
            sex: selectedPatient?.sex,
            address: selectedPatient?.address,
            date: values.date || "",
            reason: values.reason || "",
            diagnosis: values.diagnosis || "",
            recommendation: values.recommendation || ""
          }}
          doctor={{
            name: "Justin Rich Dimaandal",
            title: "RMT, MD",
            specialty: "General Physician",
            contactNumber: "0917-123-4567",
            email: "justindimaandal.work@gmail.com",
            licenseNo: "1234567",
            ptrNo: "87654321",
            signatureUrl: null 
          }}
        />
      </div>
    </div>
  );
}
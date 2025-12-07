import { useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Download, Plus, Trash2, Pill, Stethoscope, Calendar, Receipt } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { RxTemplate } from "@/components/features/rx/RxTemplate";

// --- 1. SCHEMA ---
const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  diagnosis: z.string().optional(),
  date: z.string(),
  amount: z.coerce.number().min(0, "Amount is required"),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Required"),
      dosage: z.string().min(1, "Required"),
      instructions: z.string().min(1, "Required"),
      quantity: z.string().min(1, "Required"),
    })
  ).min(1, "At least one medicine is required"),
});

type PrescriptionValues = z.infer<typeof prescriptionSchema>;

// --- 2. DUMMY DATA ---
const dummyPatients = [
  { id: "1", name: "Jimuel Ronald Dimaandal", age: 21, sex: "Male", address: "Dr. Pilapit Street, Pasig City" },
  { id: "2", name: "Maria Clara", age: 28, sex: "Female", address: "456 Mabini Ave, Quezon City" },
  { id: "3", name: "Jose Rizal", age: 32, sex: "Male", address: "789 Kalaw Dr, Laguna" },
];

export default function CreateRx() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- 3. FORM INITIALIZATION ---
  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      diagnosis: "",
      amount: 0,
      medications: [
        { name: "", dosage: "", instructions: "", quantity: "" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const values = useWatch({ control: form.control });
  const selectedPatient = dummyPatients.find(p => p.id === values.patientId);

  // --- 4. PDF GENERATION ---
  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    if (!element) return;

    setIsGenerating(true);
    
    try {
        const html2canvas = (await import('html2canvas-pro')).default;
        const { jsPDF } = await import('jspdf');

        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            logging: true,
            backgroundColor: "#ffffff" 
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Half Letter Size
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [139.7, 215.9] 
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Rx_${selectedPatient?.name || 'Unknown'}.pdf`);

    } catch (error) {
        console.error("PDF Generation failed:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  function onSubmit(data: PrescriptionValues) {
    console.log("Saving Rx to Database...", data);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* --- HEADER ACTIONS --- */}
      <div className="no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Prescription</h1>
                <p className="text-sm text-slate-600">Create digital prescriptions and track billing</p>
              </div>
            </div>
          </div>
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

      {/* --- FORM AREA --- */}
      <div className="no-print">
        <Form {...form}>
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* LEFT COLUMN (Patient & Meds) */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Patient Information</CardTitle>
                  <CardDescription className="text-sm">Select patient for this prescription</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Select Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Search patient..." />
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
                  {selectedPatient && (
                    <div className="mt-5 rounded-md border border-slate-200 bg-slate-50/50 p-4">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div><span className="font-medium text-slate-700">Age:</span><span className="ml-2 text-slate-600">{selectedPatient.age}</span></div>
                        <div><span className="font-medium text-slate-700">Sex:</span><span className="ml-2 text-slate-600">{selectedPatient.sex}</span></div>
                        <div className="sm:col-span-2"><span className="font-medium text-slate-700">Address:</span><span className="ml-2 text-slate-600">{selectedPatient.address}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900">Medications</CardTitle>
                    <CardDescription className="text-sm">List of prescribed drugs</CardDescription>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    type="button" 
                    onClick={() => append({ name: "", dosage: "", instructions: "", quantity: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-3 items-start rounded-lg border border-slate-100 p-3 bg-slate-50/30">
                      <div className="col-span-12 sm:col-span-4">
                        <FormField
                          control={form.control}
                          name={`medications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel className="text-xs text-slate-500">Medicine Name</FormLabel>
                              <FormControl><Input placeholder="e.g. Amoxicillin" {...field} className="bg-white" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <FormField
                          control={form.control}
                          name={`medications.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel className="text-xs text-slate-500">Dosage</FormLabel>
                              <FormControl><Input placeholder="500mg" {...field} className="bg-white" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                         <FormField
                          control={form.control}
                          name={`medications.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel className="text-xs text-slate-500">Qty</FormLabel>
                              <FormControl><Input placeholder="#" {...field} className="bg-white" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-11 sm:col-span-3">
                        <FormField
                          control={form.control}
                          name={`medications.${index}.instructions`}
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel className="text-xs text-slate-500">Sig. / Instructions</FormLabel>
                              <FormControl><Input placeholder="1 tab BID" {...field} className="bg-white" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-1 text-center pt-7">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button" 
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN (Rx Details & Billing) */}
            <div className="space-y-6">
              
              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Rx Details</CardTitle>
                  <CardDescription className="text-sm">Date and Diagnosis</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                   <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Date Prescribed
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" /> Diagnosis / Remarks
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[150px] resize-none" 
                            placeholder="Optional diagnosis or specific remarks..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-base font-semibold text-slate-900">Billing Information</CardTitle>
                  <CardDescription className="text-sm">Fee to appear in dashboard</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Receipt className="h-4 w-4" /> Professional Fee
                        </FormLabel>
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
        {/* MOBILE ACTION BUTTONS - Visible on mobile, Hidden on desktop */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:hidden">
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
      </div>

      {/* --- HIDDEN PRINT TEMPLATE --- */}
      <div 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: "-9999px",
          backgroundColor: "#ffffff"
        }}
      >
        <RxTemplate 
          ref={componentRef}
          data={{
             patientName: selectedPatient?.name,
             age: selectedPatient?.age,
             sex: selectedPatient?.sex,
             address: selectedPatient?.address,
             date: values.date || "",
             diagnosis: values.diagnosis,
             medications: (values.medications || []).map(m => ({
                 name: m.name || "",
                 dosage: m.dosage || "",
                 instructions: m.instructions || "",
                 quantity: m.quantity || ""
             }))
          }}
          doctor={{
             name: "Justin Rich Dimaandal",
             title: "RMT, MD",
             specialty: "General Physician",
             licenseNo: "1234567",
             ptrNo: "87654321",
             // FIXED: s2No removed
          }}
        />
      </div>
    </div>
  );
}
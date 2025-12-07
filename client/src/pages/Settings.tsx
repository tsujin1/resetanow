import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import authService from "@/services/authService";
import { 
  Save, 
  Upload, 
  X, 
  Settings as SettingsIcon, 
  Building, 
  FileBadge, 
  User, 
  PenTool, 
  Eraser,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom"; // Removed: No longer need to force logout on 404

// --- 1. SCHEMA ---
const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  title: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email("Please enter a valid email."),
  contactNumber: z.string().optional(),
  clinicAddress: z.string().optional(),
  // Made these optional/loose since fallback data might be empty
  licenseNo: z.string().min(1, "License number is required.").or(z.literal("")), 
  ptrNo: z.string().optional(),
  s2No: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function Settings() {
  // const navigate = useNavigate(); // Not needed for the fallback logic
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<"upload" | "draw">("draw");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // --- 2. FORM INIT ---
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      title: "",
      role: "",
      email: "",
      contactNumber: "",
      clinicAddress: "",
      licenseNo: "",
      ptrNo: "",
      s2No: "",
    },
  });

  // --- 3. FETCH PROFILE ON LOAD ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // This now returns data even if backend 404s (thanks to your service update)
        const data = await authService.getProfile();
        console.log("📝 Settings loaded data:", data);

        // Reset form with whatever data we got (API or LocalStorage)
        form.reset({
            name: data.name || "",
            title: data.title || "",
            role: data.role || "",
            email: data.email || "",
            contactNumber: data.contactNumber || "",
            clinicAddress: data.clinicAddress || "",
            licenseNo: data.licenseNo || "",
            ptrNo: data.ptrNo || "",
            s2No: data.s2No || "",
        });

        if (data.signatureUrl) {
            setSignaturePreview(data.signatureUrl);
        }
      } catch (error) {
        console.error("❌ Component failed to load profile", error);
        // We don't force logout here anymore, allowing the UI to stay active
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [form]); 

  // Handle File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
    setSignaturePreview(null);
  };

  const saveDrawnSignature = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      setSignaturePreview(dataURL);
    }
  };

  // --- 4. SUBMIT UPDATE ---
  async function onSubmit(data: SettingsValues) {
    setIsSaving(true);
    try {
        const payload = { ...data, signatureUrl: signaturePreview };
        
        // This will update API if possible, or fallback to LocalStorage if 404
        await authService.updateProfile(payload);
        
        alert("Settings saved!"); // Simple alert for now
    } catch (error) {
        console.error(error);
        alert("Failed to save settings.");
    } finally {
        setIsSaving(false);
    }
  }

  if (isLoading) {
      return <div className="flex h-full items-center justify-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinic Settings</h1>
              <p className="text-sm text-slate-600">Manage your profile, license details, and branding</p>
            </div>
          </div>
        </div>
        
        {/* DESKTOP SAVE BUTTON */}
        <div className="hidden sm:block">
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="grid gap-0.5">
                        <CardTitle className="text-base font-semibold text-slate-900">Professional Profile</CardTitle>
                        <CardDescription className="text-sm">Information appearing on your document headers</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-slate-700">Title</FormLabel>
                            <FormControl><Input placeholder="MD" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-slate-700">Specialty</FormLabel>
                            <FormControl><Input placeholder="Physician" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-slate-700">Email Address</FormLabel>
                            <FormControl><Input {...field} disabled /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-slate-700">Contact Number</FormLabel>
                            <FormControl><Input placeholder="0917-XXX-XXXX" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <Building className="h-4 w-4" />
                    </div>
                    <div className="grid gap-0.5">
                        <CardTitle className="text-base font-semibold text-slate-900">Clinic Details</CardTitle>
                        <CardDescription className="text-sm">Physical location of your practice</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="clinicAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-slate-700">Address Line</FormLabel>
                        <FormControl>
                            <Textarea className="resize-none min-h-20" placeholder="Unit 123, Building Name, Street, City" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                   />
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <FileBadge className="h-4 w-4" />
                    </div>
                    <div className="grid gap-0.5">
                        <CardTitle className="text-base font-semibold text-slate-900">Legal Info</CardTitle>
                        <CardDescription className="text-sm">For Rx validation</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-6">
                   <FormField
                      control={form.control}
                      name="licenseNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">PRC License No.</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ptrNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">PTR No.</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="s2No"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">S2 No. (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900">E-Signature</CardTitle>
                        <CardDescription className="text-sm">Draw or upload signature</CardDescription>
                    </div>
                    <div className="flex bg-slate-200 rounded-md p-1 gap-1">
                        <button
                            type="button"
                            onClick={() => setSignatureMode("draw")}
                            className={`p-1.5 rounded text-xs font-medium transition-all ${signatureMode === "draw" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <PenTool className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setSignatureMode("upload")}
                            className={`p-1.5 rounded text-xs font-medium transition-all ${signatureMode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <Upload className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                    {/* DRAW MODE */}
                    {signatureMode === "draw" && (
                        <div className="space-y-3">
                            <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
                                <SignatureCanvas 
                                    ref={sigCanvasRef}
                                    penColor="black"
                                    canvasProps={{
                                        width: 320, 
                                        height: 160, 
                                        className: 'signature-canvas w-full h-40 bg-white cursor-crosshair'
                                    }}
                                    onEnd={saveDrawnSignature}
                                />
                            </div>
                            <div className="flex justify-between">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearSignature}
                                    className="text-slate-500 hover:text-red-600"
                                >
                                    <Eraser className="mr-2 h-4 w-4" /> Clear
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* UPLOAD MODE */}
                    {signatureMode === "upload" && (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50/30 hover:bg-slate-50 transition-colors w-full h-40">
                            {signaturePreview ? (
                                <div className="relative group w-full flex justify-center">
                                    <img src={signaturePreview} alt="Signature" className="h-16 object-contain" />
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setSignaturePreview(null)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="signature-upload" 
                                    className="w-full h-full cursor-pointer flex flex-col items-center justify-center space-y-2"
                                >
                                    <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                                        <Upload className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="text-xs text-slate-500 text-center">
                                        <span className="font-semibold text-slate-900">Click to upload</span>
                                        <br/> transparent PNG
                                    </div>
                                </label>
                            )}
                            <Input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                id="signature-upload"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* MOBILE SAVE BUTTON */}
          <div className="mt-8 block sm:hidden">
             <Button 
                onClick={form.handleSubmit(onSubmit)} 
                size="lg"
                disabled={isSaving}
                className="w-full shadow-md"
             >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                )}
             </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
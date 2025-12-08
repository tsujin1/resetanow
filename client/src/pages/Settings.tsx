import { useState, useRef, useEffect, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import authService from "@/services/authService";
import { Save, Loader2, Settings as SettingsIcon } from "lucide-react";
import { AuthContext } from "@/context/AuthContext"; 
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

// Import our new sub-components
import { ProfileCard } from "@/components/features/settings/ProfileCard";
import { ClinicCard } from "@/components/features/settings/ClinicCard";
import { LegalCard } from "@/components/features/settings/LegalCard";
import { SignatureCard } from "@/components/features/settings/SignatureCard";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  title: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email("Please enter a valid email."),
  contactNumber: z.string().optional(),
  clinicAddress: z.string().optional(),
  licenseNo: z.string().min(1, "License number is required.").or(z.literal("")), 
  ptrNo: z.string().optional(),
  s2No: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const { user, setUser } = useContext(AuthContext)!; 

  // --- FORM INIT ---
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

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
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
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
  }, [form]);

  // --- SIGNATURE HANDLERS ---
  const clearSignature = () => {
    sigCanvasRef.current?.clear();
    setSignaturePreview(null);
  };

  const saveDrawnSignature = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataURL = sigCanvasRef.current.toDataURL("image/png");
      setSignaturePreview(dataURL);
    }
  };

  // --- SUBMIT ---
  async function onSubmit(data: SettingsValues) {
    setIsSaving(true);
    toast.dismiss();

    try {
      let finalSignature = signaturePreview;
      if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
        finalSignature = sigCanvasRef.current.toDataURL("image/png");
      }

      const payload = { 
        ...data, 
        signatureUrl: finalSignature || null 
      };
      
      const result = await authService.updateProfile(payload);
      setSignaturePreview(result.signatureUrl);
      
      if (user && setUser) {
        setUser({
          ...user,
          name: data.name,
          email: data.email,
          title: data.title || user.title,
          contactNumber: data.contactNumber || user.contactNumber,
          // Add other fields that should update in sidebar
          clinicAddress: data.clinicAddress || user.clinicAddress,
        });
        
        // Also update localStorage for persistence
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          const updatedUser = {
            ...userObj,
            name: data.name,
            email: data.email,
            title: data.title || userObj.title,
            contactNumber: data.contactNumber || userObj.contactNumber,
            clinicAddress: data.clinicAddress || userObj.clinicAddress,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      
      toast.success("Settings updated successfully", {
        description: "Your profile information has been saved.",
      });

    } catch (error) {
      console.error("Failed to save settings:", error);
      
      toast.error("Failed to save settings", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
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
            
            {/* LEFT COLUMN: Profile & Clinic */}
            <div className="space-y-6 lg:col-span-2">
              <ProfileCard />
              <ClinicCard />
            </div>

            {/* RIGHT COLUMN: Legal & Signature */}
            <div className="space-y-6">
              <LegalCard />
              
              <SignatureCard 
                signaturePreview={signaturePreview}
                setSignaturePreview={setSignaturePreview}
                sigCanvasRef={sigCanvasRef}
                onClear={clearSignature}
                onSaveDraw={saveDrawnSignature}
              />
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
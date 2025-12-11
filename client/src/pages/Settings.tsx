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

// Import our sub-components
import { ProfileCard } from "@/components/features/settings/ProfileCard";
import { ClinicCard } from "@/components/features/settings/ClinicCard";
import { LegalCard } from "@/components/features/settings/LegalCard";
import { SignatureCard } from "@/components/features/settings/SignatureCard";

// 1. UPDATE SCHEMA
const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  title: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email("Please enter a valid email."),
  contactNumber: z.string().optional(),

  // Clinic Fields
  clinicAddress: z.string().optional(),
  clinicAvailability: z.string().optional(),

  licenseNo: z.string().min(1, "License number is required.").or(z.literal("")),
  ptrNo: z.string().optional(),
  s2No: z.string().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // Track initial load
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
      clinicAvailability: "",
      licenseNo: "",
      ptrNo: "",
      s2No: "",
    },
  });

  // --- FETCH DATA (only on mount) ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (hasLoaded) return; // Prevent re-fetching

      try {
        const data = await authService.getProfile();

        // Create the reset data object
        const resetData = {
          name: data.name || "",
          title: data.title || "",
          role: data.role || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          clinicAddress: data.clinicAddress || "",
          clinicAvailability: data.clinicAvailability || "",
          licenseNo: data.licenseNo || "",
          ptrNo: data.ptrNo || "",
          s2No: data.s2No || "",
        };

        // Reset form with fetched data
        form.reset(resetData);

        // Set signature preview if exists
        if (data.signatureUrl) {
          setSignaturePreview(data.signatureUrl);
        }

        setHasLoaded(true);
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [form, hasLoaded]);

  // --- SYNC FORM WITH CONTEXT (when context changes externally) ---
  useEffect(() => {
    if (!user || hasLoaded) return;

    // Only sync if form hasn't been manually modified
    // You can add more sophisticated dirty checking here
    const currentValues = form.getValues();
    const isFormEmpty = Object.values(currentValues).every(
      (val) => val === "" || val === undefined,
    );

    if (isFormEmpty && user) {
      const userData = {
        name: user.name || "",
        title: user.title || "",
        role: user.role || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        clinicAddress: user.clinicAddress || "",
        clinicAvailability: user.clinicAvailability || "",
        licenseNo: user.licenseNo || "",
        ptrNo: user.ptrNo || "",
        s2No: user.s2No || "",
      };

      form.reset(userData);
      if (user.signatureUrl) {
        setSignaturePreview(user.signatureUrl);
      }
      setHasLoaded(true);
    }
  }, [user, form, hasLoaded]);

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
      // 1. Prepare Payload
      let finalSignature = signaturePreview;
      if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
        finalSignature = sigCanvasRef.current.toDataURL("image/png");
      }

      const payload = {
        ...data,
        signatureUrl: finalSignature || "",
      };

      // 2. Send to Backend
      const result = await authService.updateProfile(payload);

      // 3. Update Local Preview
      if (result.signatureUrl) {
        setSignaturePreview(result.signatureUrl);
      }

      // 4. Update Global Context & Local Storage
      if (user && setUser) {
        const updatedUserLocal = {
          ...user,
          // Update all fields from form data
          name: data.name,
          email: data.email,
          title: data.title || "",
          role: data.role || "",
          contactNumber: data.contactNumber || "",
          clinicAddress: data.clinicAddress || "",
          clinicAvailability: data.clinicAvailability || "",
          licenseNo: data.licenseNo || "",
          ptrNo: data.ptrNo || "",
          s2No: data.s2No || "",
          // Update signature
          signatureUrl: result.signatureUrl || user.signatureUrl || "",
        };

        // Update State
        setUser(updatedUserLocal);

        // Update Local Storage
        localStorage.setItem("user", JSON.stringify(updatedUserLocal));
      }

      // 5. Show success message
      toast.success("Settings updated successfully", {
        description: "Your profile information has been saved.",
      });

      // 6. Mark form as clean (optional, if using formState.isDirty)
      form.reset(data, { keepValues: true });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Settings
              </h1>
              <p className="text-sm text-slate-600">
                Manage your profile, license details, and branding
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving || !hasLoaded}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
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
              disabled={isSaving || !hasLoaded}
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

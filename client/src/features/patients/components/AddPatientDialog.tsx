import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import patientService from "@/features/patients/services/patientService";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 1. Schema Definition
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(0, "Age must be a positive number."),
  gender: z.enum(["Male", "Female"]),
  contactNumber: z.string().min(10, "Contact number is too short."),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

// Props interface
interface AddPatientDialogProps {
  className?: string;
  onPatientAdded?: () => void | Promise<void>;
  onSuccess?: (message: string) => void;
}

export default function AddPatientDialog({
  className,
  onPatientAdded,
  onSuccess,
}: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Form Initialization
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      contactNumber: "",
      gender: "Male" as const,
      address: "",
    },
  });

  // 3. Submit Handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create patient via API
      await patientService.createPatient({
        name: data.name,
        age: data.age,
        gender: data.gender,
        contactNumber: data.contactNumber,
        address: data.address,
      });

      // Notify parent component to refresh patient list FIRST (before closing dialog)
      // This ensures the data is fetched and state is updated before the dialog closes
      if (onPatientAdded) {
        await onPatientAdded();
        // Wait for next animation frame to ensure React has processed the state update
        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(undefined)),
        );
      }

      // Reset form and close dialog AFTER refresh completes
      form.reset();
      setOpen(false);

      // Notify parent component of success
      if (onSuccess) {
        onSuccess(`Patient "${data.name}" added successfully!`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create patient";
      setError(errorMessage);
      console.error("Error creating patient:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* ADDED: Pass className here to control width */}
        <Button className={className}>
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient details below.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Age Field */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          // If field is empty or user is typing, allow empty string
                          if (value === "") {
                            field.onChange(0);
                          } else {
                            const numValue = Number(value);
                            field.onChange(isNaN(numValue) ? 0 : numValue);
                          }
                        }}
                        onFocus={(e) => {
                          // Clear the 0 when user focuses on the field
                          if (field.value === 0) {
                            e.target.value = "";
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Field (Updated) */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Field */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="0917-XXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rizal St, Manila" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Patient"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

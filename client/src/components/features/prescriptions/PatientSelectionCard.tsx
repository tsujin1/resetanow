import type { Control } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
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
import type { IPatient } from "@/features/patients/types";
import type { PrescriptionValues } from "@/features/prescriptions/schemas/prescription";

interface PatientSelectionCardProps {
  control: Control<PrescriptionValues>;
  patients: IPatient[];
  isLoadingPatients: boolean;
  selectedPatient: IPatient | undefined;
}

export default function PatientSelectionCard({
  control,
  patients,
  isLoadingPatients,
  selectedPatient,
}: PatientSelectionCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-semibold text-slate-900">
          Patient Information
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Select patient for this prescription
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Changed from simple grid-cols-2 to a 12-column system for better proportions */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Patient Selection Field: Takes up 8/12 columns (wider) */}
          <div className="md:col-span-8">
            <FormField
              control={control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Select Patient
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      {/* CSS trick: [&_.patient-meta]:hidden hides the Age/Gender span only in the trigger */}
                      <SelectTrigger className="h-10 w-full bg-white border-slate-200 focus:ring-slate-400 [&_.patient-meta]:hidden">
                        <SelectValue placeholder="Select a patient..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingPatients ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Loading patients...
                        </div>
                      ) : patients.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">
                          No patients found.
                        </div>
                      ) : (
                        patients.map((p) => (
                          <SelectItem
                            key={p._id}
                            value={p._id}
                            className="cursor-pointer focus:bg-slate-50 py-3"
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-slate-900">
                                {p.name}
                              </span>
                              <span className="text-xs text-slate-500 patient-meta">
                                {p.age} yrs • {p.gender}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Picker Field: Takes up 4/12 columns (narrower) */}
          <div className="md:col-span-4">
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Consultation Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="h-10 w-full border-slate-200 bg-white focus-visible:ring-slate-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Selected Patient Preview - Aligned to match the grid above */}
        {selectedPatient && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/50 p-5">
            <div className="grid gap-4 text-sm md:grid-cols-12">
              {/* Age - Aligned within the first section */}
              <div className="flex items-center md:col-span-4">
                <span className="min-w-[70px] font-semibold text-slate-800">
                  Age:
                </span>
                <span className="text-slate-600">{selectedPatient.age}</span>
              </div>

              {/* Gender - Aligned within the first section */}
              <div className="flex items-center md:col-span-4">
                <span className="min-w-[70px] font-semibold text-slate-800">
                  Gender:
                </span>
                <span className="text-slate-600">{selectedPatient.gender}</span>
              </div>

              {/* Address - Spans full width on mobile, shares width on desktop */}
              <div className="flex items-start md:col-span-12 lg:col-span-12">
                <span className="min-w-[70px] shrink-0 font-semibold text-slate-800 pt-0.5">
                  Address:
                </span>
                <span className="text-slate-600 leading-relaxed">
                  {selectedPatient.address}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


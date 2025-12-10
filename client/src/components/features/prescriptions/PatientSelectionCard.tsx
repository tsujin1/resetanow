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
import type { Control } from "react-hook-form";
import type { IPatient } from "@/types";
import type { PrescriptionValues } from "@/pages/CreateRx";

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
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Patient Information
        </CardTitle>
        <CardDescription className="text-sm">
          Select patient for this prescription
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-700">
                Select Patient
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Search patient..." />
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
                      No patients found. Please add a patient first.
                    </div>
                  ) : (
                    patients.map((p) => (
                      <SelectItem
                        key={p._id}
                        value={p._id}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-slate-500 text-left">
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
        {selectedPatient && (
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50/50 p-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="font-medium text-slate-700">Age:</span>
                <span className="ml-2 text-slate-600">
                  {selectedPatient.age}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Gender:</span>
                <span className="ml-2 text-slate-600">
                  {selectedPatient.gender}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-slate-700">Address:</span>
                <span className="ml-2 text-slate-600">
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

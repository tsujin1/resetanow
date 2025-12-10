import type { Control } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { MedCertValues } from "@/schemas/medCert";
import type { IPatient } from "@/types";

interface PatientInfoCardProps {
  control: Control<MedCertValues>;
  patients: IPatient[];
  isLoading: boolean;
  selectedPatient?: IPatient;
}

export function PatientInfoCard({
  control,
  patients,
  isLoading,
  selectedPatient,
}: PatientInfoCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Patient Information
        </CardTitle>
        <CardDescription className="text-sm">
          Select patient and consultation date
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Patient Select */}
          <FormField
            control={control}
            name="patientId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">
                  Patient Name
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a patient..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading patients...
                      </SelectItem>
                    ) : patients.length === 0 ? (
                      <SelectItem value="no-patients" disabled>
                        No patients found
                      </SelectItem>
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

          {/* Date Picker */}
          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">
                  Consultation Date
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Selected Patient Details Display */}
        {selectedPatient && (
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50/50 p-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="font-medium text-slate-700">Age:</span>
                <span className="ml-2 text-slate-600">
                  {selectedPatient.age} years old
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

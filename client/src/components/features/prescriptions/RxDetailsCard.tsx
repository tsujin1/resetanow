import { Calendar, Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { PrescriptionValues } from "@/features/prescriptions/schemas/prescription";

interface RxDetailsCardProps {
  control: Control<PrescriptionValues>;
}

export default function RxDetailsCard({ control }: RxDetailsCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Rx Details
        </CardTitle>
        <CardDescription className="text-sm">
          Date and Diagnosis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {/* Date Field */}
        <FormField
          control={control}
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

        {/* Diagnosis Field */}
        <FormField
          control={control}
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
  );
}


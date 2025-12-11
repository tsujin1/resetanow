import { Building } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ClinicCard() {
  const { control } = useFormContext();

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <Building className="h-4 w-4" />
        </div>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold text-slate-900">
            Clinic Details
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Physical location and operating hours
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Grid Layout: 12 columns for desktop, single column for mobile */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Address Field (Wider - 7 cols) */}
          <div className="md:col-span-7">
            <FormField
              control={control}
              name="clinicAddress"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Clinic Address
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none min-h-[5.5rem] bg-white border-slate-200 focus:border-slate-400 focus:ring-0"
                      placeholder="Unit 123, Building Name, Street, City"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Availability Field (Narrower - 5 cols) */}
          <div className="md:col-span-5">
            <FormField
              control={control}
              name="clinicAvailability"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Availability / Schedule
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none min-h-[5.5rem] bg-white border-slate-200 focus:border-slate-400 focus:ring-0"
                      placeholder="e.g. Mon - Sat: 9:00 AM - 5:00 PM"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

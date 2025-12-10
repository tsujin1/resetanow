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
          <CardDescription className="text-sm">
            Physical location of your practice
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="clinicAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Address Line</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none min-h-20"
                  placeholder="Unit 123, Building Name, Street, City"
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

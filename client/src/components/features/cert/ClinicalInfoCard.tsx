import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ClinicalInfoCard() {
  const { control } = useFormContext();

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">Clinical Information</CardTitle>
        <CardDescription className="text-sm">Document consultation findings and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          <FormField
            control={control}
            name="reason"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">Reason for Consultation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Annual physical examination" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">Assessment / Diagnosis</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[120px] resize-none" placeholder="Enter findings..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="recommendation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-700">Medical Recommendation</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[120px] resize-none" placeholder="Enter recommendation..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
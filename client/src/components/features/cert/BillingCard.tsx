import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function BillingCard() {
  const { control } = useFormContext();
  const amount = useWatch({ control, name: "amount" });

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Billing Information
        </CardTitle>
        <CardDescription className="text-sm">
          Consultation fee details
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-700">
                Consultation Fee
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    ₱
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    // FIXED: Handle empty/NaN values safely
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(val);
                    }}
                    className="h-10 pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium text-slate-900">
              ₱{Number(amount || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
            <span className="font-semibold text-slate-900">Total Amount</span>
            <span className="text-lg font-bold text-slate-900">
              ₱{Number(amount || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

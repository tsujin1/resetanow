import { Receipt } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { PrescriptionValues } from "@/pages/CreateRx";

interface BillingCardProps {
  control: Control<PrescriptionValues>;
  amount: number;
}

export default function BillingCard({ control, amount }: BillingCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Billing Information
        </CardTitle>
        <CardDescription className="text-sm">
          Fee to appear in dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Professional Fee
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
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

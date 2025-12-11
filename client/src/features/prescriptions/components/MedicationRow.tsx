import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldArrayWithId } from "react-hook-form";
import type { PrescriptionValues } from "@/features/prescriptions/schemas/prescription";

interface MedicationRowProps {
  control: Control<PrescriptionValues>;
  field: FieldArrayWithId<PrescriptionValues, "medications">;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function MedicationRow({
  control,
  index,
  onRemove,
  canRemove,
}: MedicationRowProps) {
  return (
    <div className="group relative rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400">
      <div className="grid gap-4 md:grid-cols-12">
        {/* --- ROW 1: Medicine Details --- */}

        {/* Name */}
        <div className="md:col-span-5">
          <FormField
            control={control}
            name={`medications.${index}.name`}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Medicine
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Amoxicillin"
                    {...field}
                    className="h-9 border-slate-200 focus-visible:ring-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dosage */}
        <div className="md:col-span-4">
          <FormField
            control={control}
            name={`medications.${index}.dosage`}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Dosage
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 500mg"
                    {...field}
                    className="h-9 border-slate-200 focus-visible:ring-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quantity */}
        <div className="md:col-span-3">
          <FormField
            control={control}
            name={`medications.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Qty
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 21 tabs"
                    {...field}
                    className="h-9 border-slate-200 focus-visible:ring-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* --- ROW 2: Instructions & Actions --- */}

        {/* Instructions (Spans most width) */}
        <div className="md:col-span-11">
          <FormField
            control={control}
            name={`medications.${index}.instructions`}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sig / Instructions
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Take 1 tablet every 8 hours for 7 days"
                    {...field}
                    className="h-9 border-slate-200 focus-visible:ring-slate-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Delete Button (Aligned to bottom right on desktop) */}
        <div className="flex items-end justify-end md:col-span-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            className="h-9 w-9 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Remove medication"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


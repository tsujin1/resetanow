import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { Control, FieldArrayWithId } from "react-hook-form";
import type { PrescriptionValues } from "@/schemas/prescription";

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
    <div className="group relative grid gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 sm:grid-cols-12">
      {/* Name */}
      <div className="sm:col-span-4">
        <FormField
          control={control}
          name={`medications.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Medicine Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Dosage */}
      <div className="sm:col-span-3">
        <FormField
          control={control}
          name={`medications.${index}.dosage`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Dosage (e.g. 500mg)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Quantity */}
      <div className="sm:col-span-3">
        <FormField
          control={control}
          name={`medications.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Qty (e.g. 30 tabs)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Instructions */}
      <div className="sm:col-span-11">
        <FormField
          control={control}
          name={`medications.${index}.instructions`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Sig / Instructions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Delete Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-red-500 sm:static sm:col-span-1 sm:h-10 sm:w-full"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


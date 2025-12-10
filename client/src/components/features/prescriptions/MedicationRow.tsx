import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldArrayWithId } from "react-hook-form";
import type { PrescriptionValues } from "@/pages/CreateRx";

interface MedicationRowProps {
  control: Control<PrescriptionValues>;
  field: FieldArrayWithId<PrescriptionValues, "medications">;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function MedicationRow({
  control,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: _field,
  index,
  onRemove,
  canRemove,
}: MedicationRowProps) {
  // field is used for the key prop in MedicationsCard.map(), but not directly in this component
  return (
    <div className="grid grid-cols-12 gap-3 items-start rounded-lg border border-slate-100 p-3 bg-slate-50/30">
      <div className="col-span-12 sm:col-span-4">
        <FormField
          control={control}
          name={`medications.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-slate-500">
                Medicine Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Amoxicillin"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6 sm:col-span-2">
        <FormField
          control={control}
          name={`medications.${index}.dosage`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-slate-500">Dosage</FormLabel>
              <FormControl>
                <Input placeholder="500mg" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6 sm:col-span-2">
        <FormField
          control={control}
          name={`medications.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-slate-500">Qty</FormLabel>
              <FormControl>
                <Input placeholder="#" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-11 sm:col-span-3">
        <FormField
          control={control}
          name={`medications.${index}.instructions`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-slate-500">
                Sig. / Instructions
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="1 tab BID"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-1 text-center pt-7">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


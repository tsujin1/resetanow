import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MedicationRow from "./MedicationRow";
import type { Control, FieldArrayWithId } from "react-hook-form";
import type { PrescriptionValues } from "@/pages/CreateRx";

interface MedicationsCardProps {
  control: Control<PrescriptionValues>;
  fields: FieldArrayWithId<PrescriptionValues, "medications">[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function MedicationsCard({
  control,
  fields,
  onAdd,
  onRemove,
}: MedicationsCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">
            Medications
          </CardTitle>
          <CardDescription className="text-sm">
            List of prescribed drugs
          </CardDescription>
        </div>
        <Button variant="secondary" size="sm" type="button" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {fields.map((field, index) => (
          <MedicationRow
            key={field.id}
            control={control}
            field={field}
            index={index}
            onRemove={onRemove}
            canRemove={fields.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

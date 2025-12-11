import { Users } from "lucide-react";
import AddPatientDialog from "@/features/patients/components/AddPatientDialog";

interface PatientHeaderProps {
  onPatientAdded?: () => void | Promise<void>;
}

export default function PatientHeader({ onPatientAdded }: PatientHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Patients
            </h1>
            <p className="text-sm text-slate-600">
              Manage patient records and medical history
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP BUTTON: Hidden on mobile (hidden), Visible on desktop (sm:block) */}
      <div className="hidden sm:block">
        <AddPatientDialog onPatientAdded={onPatientAdded} />
      </div>
    </div>
  );
}

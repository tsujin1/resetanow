import { User, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials, formatDate } from "../utils/patientUtils";
import type { IPatient } from "@/features/patients/types";

interface PatientInfoCardProps {
  patient: IPatient;
}

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-base font-semibold text-slate-700">
              {getInitials(patient.name)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {patient.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Age & Gender</p>
                  <p className="text-slate-900 font-medium">
                    {patient.age} yrs • {patient.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Contact Number</p>
                  <p className="text-slate-900 font-medium">
                    {patient.contactNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Last Visit</p>
                  <p className="text-slate-900 font-medium">
                    {formatDate(patient.lastVisit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

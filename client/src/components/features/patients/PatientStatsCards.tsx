import { Users, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IPatient } from "@/types";

interface PatientStatsCardsProps {
  patients: IPatient[];
  isLoading: boolean;
}

export default function PatientStatsCards({
  patients,
  isLoading,
}: PatientStatsCardsProps) {
  const maleCount = patients.filter((p) => p.gender === "Male").length;
  const femaleCount = patients.filter((p) => p.gender === "Female").length;
  const totalPatients = patients.length;
  const averageAge =
    totalPatients > 0
      ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / totalPatients)
      : 0;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {/* Male Count */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
          <CardTitle className="text-sm font-medium text-slate-700">
            Male Patients
          </CardTitle>
          <Users className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-slate-900">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              maleCount
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalPatients > 0
              ? Math.round((maleCount / totalPatients) * 100)
              : 0}
            % of total
          </p>
        </CardContent>
      </Card>

      {/* Female Count */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
          <CardTitle className="text-sm font-medium text-slate-700">
            Female Patients
          </CardTitle>
          <Users className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-slate-900">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              femaleCount
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalPatients > 0
              ? Math.round((femaleCount / totalPatients) * 100)
              : 0}
            % of total
          </p>
        </CardContent>
      </Card>

      {/* Average Age */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
          <CardTitle className="text-sm font-medium text-slate-700">
            Average Age
          </CardTitle>
          <Calendar className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-slate-900">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              averageAge
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Years old</p>
        </CardContent>
      </Card>
    </div>
  );
}


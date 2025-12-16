import { Pill, FileBadge, History, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

interface PatientHistoryStatsProps {
  prescriptions: IPrescription[];
  medCerts: IMedCert[];
  totalRecords: number;
  totalFees: number;
}

export default function PatientHistoryStats({
  prescriptions,
  medCerts,
  totalRecords,
  totalFees,
}: PatientHistoryStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="bg-white border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Prescriptions</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {prescriptions.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalRecords > 0
                  ? Math.round((prescriptions.length / totalRecords) * 100)
                  : 0}
                % of total
              </p>
            </div>
            <div className="h-10 w-10 rounded flex items-center justify-center bg-slate-50">
              <Pill className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Medical Certificates</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {medCerts.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalRecords > 0
                  ? Math.round((medCerts.length / totalRecords) * 100)
                  : 0}
                % of total
              </p>
            </div>
            <div className="h-10 w-10 rounded flex items-center justify-center bg-slate-50">
              <FileBadge className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Records</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                {totalRecords}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across all patient visits
              </p>
            </div>
            <div className="h-10 w-10 rounded flex items-center justify-center bg-slate-50">
              <History className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Fees</p>
              <p className="text-3xl font-semibold text-slate-900 mt-2">
                ₱{totalFees.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalRecords > 0
                  ? `₱${Math.round(totalFees / totalRecords).toLocaleString()} avg per record`
                  : "No records"}
              </p>
            </div>
            <div className="h-10 w-10 rounded flex items-center justify-center bg-slate-50">
              <Wallet className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

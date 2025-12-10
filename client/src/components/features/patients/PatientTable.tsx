import { Search, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import PatientTableRow from "./PatientTableRow";
import type { IPatient } from "@/types";

interface PatientTableProps {
  patients: IPatient[];
  filteredPatients: IPatient[];
  isLoading: boolean;
  onPatientDeleted: () => void | Promise<void>;
}

export default function PatientTable({
  patients,
  filteredPatients,
  isLoading,
  onPatientDeleted,
}: PatientTableProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="h-12 font-semibold text-slate-700 pl-6">
                Patient Name
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Age
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Gender
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Contact
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Last Visit
              </TableHead>
              <TableHead className="h-12 text-right font-semibold text-slate-700 pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-3" />
                    <p className="text-sm font-medium text-slate-900">
                      Loading patients...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientTableRow
                  key={patient._id}
                  patient={patient}
                  onPatientDeleted={onPatientDeleted}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {patients.length === 0
                        ? "No patients found"
                        : "No patients match your search"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {patients.length === 0
                        ? "Add your first patient to get started"
                        : "Try adjusting your search terms"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

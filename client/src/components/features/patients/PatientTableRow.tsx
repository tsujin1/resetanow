import { MoreHorizontal, FilePlus, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import patientService from "@/services/patientService";
import type { IPatient } from "@/types";

interface PatientTableRowProps {
  patient: IPatient;
  onPatientDeleted: () => void | Promise<void>;
}

export default function PatientTableRow({
  patient,
  onPatientDeleted,
}: PatientTableRowProps) {
  const getDaysSinceVisit = (lastVisit: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(lastVisit).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const daysSince = getDaysSinceVisit(patient.lastVisit);
  const isRecent = daysSince <= 7;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
      try {
        await patientService.deletePatient(patient._id);
        await onPatientDeleted();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete patient";
        alert(errorMessage);
      }
    }
  };

  return (
    <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <TableCell className="py-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-xs text-slate-600 border border-slate-200">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-sm text-slate-900">{patient.name}</p>
            <p className="text-xs text-slate-500 font-mono">
              ID: {patient._id}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 text-sm text-slate-600">
        {patient.age} yrs
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant="outline"
          className="border-slate-200 bg-white text-slate-600 font-normal capitalize"
        >
          {patient.gender}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-sm text-slate-600 font-mono">
        {patient.contactNumber}
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-900 font-medium">
              {new Date(patient.lastVisit).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {isRecent && (
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            )}
          </div>
          <span className="text-xs text-slate-500">{daysSince} days ago</span>
        </div>
      </TableCell>
      <TableCell className="py-4 pr-6 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100 data-[state=open]:bg-slate-100 text-slate-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <FilePlus className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span>Create Prescription</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileBadge className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span>Create Med Cert</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleDelete}
            >
              <span>Delete Patient</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

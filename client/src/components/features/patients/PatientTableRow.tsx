import {
  MoreHorizontal,
  FilePlus,
  FileBadge,
  Trash2,
  AlertTriangle,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import patientService from "@/features/patients/services/patientService";
import type { IPatient } from "@/features/patients/types";
import { useState } from "react";

interface PatientTableRowProps {
  patient: IPatient;
  onPatientDeleted: () => void | Promise<void>;
}

export default function PatientTableRow({
  patient,
  onPatientDeleted,
}: PatientTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getDaysSinceVisit = (lastVisit: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(lastVisit).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const daysSince = getDaysSinceVisit(patient.lastVisit);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await patientService.deletePatient(patient._id);
      setOpen(false);
      await onPatientDeleted();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete patient";
      setDeleteError(errorMessage);
      console.error("Error deleting patient:", err);
    } finally {
      setIsDeleting(false);
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
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                navigate(
                  `/create-rx?patientId=${patient._id}&patientName=${encodeURIComponent(patient.name)}`,
                )
              }
            >
              <FilePlus className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span>Create Prescription</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                navigate(
                  `/create-mc?patientId=${patient._id}&patientName=${encodeURIComponent(patient.name)}`,
                )
              }
            >
              <FileBadge className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span>Create Med Cert</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate(`/patients/${patient._id}/history`)}
            >
              <History className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <span>View History</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onSelect={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5 text-red-600" />
              <span>Delete Patient</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <AlertDialogTitle className="text-slate-900">
                  Delete Patient
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600 pt-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {patient.name}
                </span>
                ? This action cannot be undone and will permanently remove all
                patient data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{deleteError}</p>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? (
                  <>
                    <span className="mr-2">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Patient
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

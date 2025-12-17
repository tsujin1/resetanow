import { Trash2, AlertTriangle } from "lucide-react";
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

interface DeleteRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordName: string;
  isDeleting: boolean;
  deleteError: string | null;
  onDelete: () => void;
}

export default function DeleteRecordDialog({
  open,
  onOpenChange,
  recordName,
  isDeleting,
  deleteError,
  onDelete,
}: DeleteRecordDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-slate-900">
              Delete {recordName}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-600 pt-2">
            Are you sure you want to delete this {recordName.toLowerCase()}?
            This action cannot be undone and will permanently remove this
            record.
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
            onClick={onDelete}
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
                Delete {recordName}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



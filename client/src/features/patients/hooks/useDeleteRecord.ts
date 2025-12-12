import { useState } from "react";
import prescriptionService from "@/features/prescriptions/services/prescriptionService";
import medCertService from "@/features/medcert/services/medCertService";

export function useDeleteRecord(onSuccess: () => void | Promise<void>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialogOpen) return;

    const [type, recordId] = deleteDialogOpen.split(":");
    try {
      setIsDeleting(true);
      setDeleteError(null);

      if (type === "prescription") {
        await prescriptionService.deletePrescription(recordId);
      } else if (type === "medcert") {
        await medCertService.deleteMedCert(recordId);
      }

      setDeleteDialogOpen(null);
      await onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete record";
      setDeleteError(errorMessage);
      console.error("Error deleting record:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    deleteError,
    handleDelete,
  };
}

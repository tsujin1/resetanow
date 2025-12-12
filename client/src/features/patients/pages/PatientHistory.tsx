import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, History, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePatientHistory } from "../hooks/usePatientHistory";
import { useDeleteRecord } from "../hooks/useDeleteRecord";
import PatientInfoCard from "../components/PatientInfoCard";
import PatientHistoryStats from "../components/PatientHistoryStats";
import HistoryRecordCard from "../components/HistoryRecordCard";
import DeleteRecordDialog from "../components/DeleteRecordDialog";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

export default function PatientHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, error, patient, prescriptions, medCerts, refreshHistory } =
    usePatientHistory(id);

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    deleteError,
    handleDelete,
  } = useDeleteRecord(refreshHistory);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading records...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button
          variant="ghost"
          onClick={() => navigate("/patients")}
          className="h-8 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load history</AlertTitle>
          <AlertDescription>
            {error || "Patient record not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Combine and sort all history records
  const allHistory = [
    ...prescriptions.map((rx: IPrescription) => ({
      type: "prescription" as const,
      id: rx._id,
      date: rx.date,
      createdAt: rx.createdAt || rx.date,
      data: rx,
    })),
    ...medCerts.map((mc: IMedCert) => ({
      type: "medcert" as const,
      id: mc._id,
      date: mc.date,
      createdAt: mc.createdAt || mc.date,
      data: mc,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalFees = allHistory.reduce(
    (sum, item) => sum + (item.data.amount || 0),
    0,
  );

  const handleDeleteClick = (type: string, recordId: string) => {
    setDeleteDialogOpen(`${type}:${recordId}`);
  };

  const getRecordName = () => {
    if (!deleteDialogOpen) return "";
    const [type] = deleteDialogOpen.split(":");
    return type === "prescription" ? "Prescription" : "Medical Certificate";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/patients")}
          className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-white mt-1 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-slate-900">Patient History</h1>
          <p className="text-sm text-slate-600">
            View complete medical records and visit timeline
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
      <PatientInfoCard patient={patient} />

      {/* Stats Cards */}
      <PatientHistoryStats
        prescriptions={prescriptions}
        medCerts={medCerts}
        totalRecords={allHistory.length}
        totalFees={totalFees}
      />

      {/* Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3">
          <History className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">
            Medical Records
          </h3>
        </div>

        {allHistory.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="py-16 text-center">
              <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <History className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                No Records Found
              </p>
              <p className="text-sm text-slate-500 mt-1">
                This patient has no medical history yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {allHistory.map((item) => (
              <HistoryRecordCard
                key={`${item.type}-${item.id}`}
                item={item}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteRecordDialog
        open={!!deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
        recordName={getRecordName()}
        isDeleting={isDeleting}
        deleteError={deleteError}
        onDelete={handleDelete}
      />
    </div>
  );
}

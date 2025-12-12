import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  FileBadge,
  Calendar,
  Loader2,
  AlertCircle,
  Phone,
  User,
  Clock,
  Pill,
  Stethoscope,
  Wallet,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import prescriptionService from "@/features/prescriptions/services/prescriptionService";
import medCertService from "@/features/medcert/services/medCertService";
import type { IPatient } from "@/features/patients/types";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function PatientHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [medCerts, setMedCerts] = useState<IMedCert[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await patientService.getPatientHistory(id);
        setPatient(data.patient);
        setPrescriptions(data.prescriptions);
        setMedCerts(data.medCerts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load patient history";
        setError(errorMessage);
        console.error("Error fetching patient history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const allHistory = [
    ...prescriptions.map((rx) => ({
      type: "prescription" as const,
      id: rx._id,
      date: rx.date,
      createdAt: rx.createdAt || rx.date,
      data: rx,
    })),
    ...medCerts.map((mc) => ({
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
      // Refresh the history
      if (id) {
        const data = await patientService.getPatientHistory(id);
        setPatient(data.patient);
        setPrescriptions(data.prescriptions);
        setMedCerts(data.medCerts);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete record";
      setDeleteError(errorMessage);
      console.error("Error deleting record:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRecordName = () => {
    if (!deleteDialogOpen) return "";
    const [type, recordId] = deleteDialogOpen.split(":");
    const record = allHistory.find((item) => item.id === recordId);
    if (!record) return "";
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
          <h1 className="text-xl font-semibold text-slate-700">
            Patient History
          </h1>
          <p className="text-sm text-slate-500">
            View complete medical records and visit timeline
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
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

      {/* Stats Cards */}
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
                  {allHistory.length > 0
                    ? Math.round(
                      (prescriptions.length / allHistory.length) * 100,
                    )
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
                  {allHistory.length > 0
                    ? Math.round((medCerts.length / allHistory.length) * 100)
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
                  {allHistory.length}
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
                  {allHistory.length > 0
                    ? `₱${Math.round(totalFees / allHistory.length).toLocaleString()} avg per record`
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
              <Card
                key={`${item.type}-${item.id}`}
                className="bg-white border-slate-200 hover:border-slate-300 transition-colors"
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Badge
                        variant={
                          item.type === "prescription" ? "default" : "secondary"
                        }
                        className={
                          item.type === "prescription"
                            ? "bg-slate-900 hover:bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                      >
                        {item.type === "prescription"
                          ? "Prescription"
                          : "Medical Certificate"}
                      </Badge>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="text-slate-300 hidden sm:inline">
                          •
                        </span>
                        <span className="whitespace-nowrap">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteDialogOpen(`${item.type}:${item.id}`)
                      }
                      className="h-8 w-8 p-0 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  {item.type === "prescription" ? (
                    <div className="space-y-4">
                      {/* Diagnosis */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Diagnosis
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 pl-6">
                          {item.data.diagnosis || "No diagnosis recorded"}
                        </p>
                      </div>

                      {/* Medications */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Medications
                          </span>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-x-auto -mx-1 sm:mx-0">
                          <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                                  Medicine
                                </th>
                                <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                                  Dosage
                                </th>
                                <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                                  Frequency
                                </th>
                                <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-slate-500">
                                  Qty
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.data.medications.map((med, idx) => (
                                <tr key={idx} className="bg-white">
                                  <td className="px-3 sm:px-4 py-2.5 text-slate-900 font-medium">
                                    {med.name}
                                  </td>
                                  <td className="px-3 sm:px-4 py-2.5 text-slate-600">
                                    {med.dosage}
                                  </td>
                                  <td className="px-3 sm:px-4 py-2.5 text-slate-600">
                                    {med.instructions}
                                  </td>
                                  <td className="px-3 sm:px-4 py-2.5 text-right text-slate-600">
                                    {med.quantity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                          Fee:{" "}
                          <span className="font-semibold text-slate-900">
                            ₱{item.data.amount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Med Cert Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Reason
                          </p>
                          <p className="text-sm text-slate-900">
                            {item.data.reason}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Diagnosis
                          </p>
                          <p className="text-sm text-slate-900">
                            {item.data.diagnosis}
                          </p>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                          Recommendation
                        </p>
                        <p className="text-sm text-slate-700">
                          {item.data.recommendation}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                          Fee:{" "}
                          <span className="font-semibold text-slate-900">
                            ₱{item.data.amount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-[400px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-slate-900">
                Delete {getRecordName()}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete this{" "}
              {getRecordName().toLowerCase()}? This action cannot be undone and
              will permanently remove this record.
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
                  Delete {getRecordName()}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

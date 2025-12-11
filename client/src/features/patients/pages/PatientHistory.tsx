import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  FileText,
  FileBadge,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import patientService from "@/features/patients/services/patientService";
import type { IPatient } from "@/features/patients/types";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

export default function PatientHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [medCerts, setMedCerts] = useState<IMedCert[]>([]);

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading patient history...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/patients")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Patient not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Combine and sort all history items by date
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
  ].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Most recent first
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/patients")}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Patient History
            </h1>
            <p className="text-sm text-slate-500 mt-1">{patient.name}</p>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 font-semibold text-lg text-slate-600 border border-slate-200">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {patient.name}
            </h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
              <span>{patient.age} years old</span>
              <span>•</span>
              <span className="capitalize">{patient.gender}</span>
              <span>•</span>
              <span>{patient.contactNumber}</span>
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Last Visit: {formatDate(patient.lastVisit)}
            </div>
          </div>
        </div>
      </Card>

      {/* History Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Prescriptions</p>
              <p className="text-2xl font-bold text-slate-900">
                {prescriptions.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <FileBadge className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Medical Certificates</p>
              <p className="text-2xl font-bold text-slate-900">
                {medCerts.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <History className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Records</p>
              <p className="text-2xl font-bold text-slate-900">
                {allHistory.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* History Timeline */}
      {allHistory.length === 0 ? (
        <Card className="p-12 border-slate-200">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No History Found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              This patient doesn't have any prescriptions or medical certificates
              yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            History Timeline
          </h2>
          {allHistory.map((item, index) => (
            <Card
              key={`${item.type}-${item.id}`}
              className="p-6 border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    {item.type === "prescription" ? (
                      <FileText className="h-5 w-5 text-slate-600" />
                    ) : (
                      <FileBadge className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  {index < allHistory.length - 1 && (
                    <div className="w-0.5 h-full min-h-8 bg-slate-200 mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {item.type === "prescription"
                          ? "Prescription"
                          : "Medical Certificate"}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {item.type === "prescription" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">
                          Date: {formatDate(item.data.date)}
                        </span>
                      </div>
                      {item.data.diagnosis && (
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Diagnosis:</span>{" "}
                          {item.data.diagnosis}
                        </p>
                      )}
                      <div className="mt-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">
                          Medications:
                        </p>
                        <div className="space-y-1">
                          {item.data.medications.map((med, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-slate-700 bg-slate-50 p-2 rounded"
                            >
                              <span className="font-medium">{med.name}</span> -{" "}
                              {med.dosage} - {med.instructions} ({med.quantity})
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-700">
                          Amount: ₱{item.data.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">
                          Date: {formatDate(item.data.date)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {item.data.reason}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Diagnosis:</span>{" "}
                        {item.data.diagnosis}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Recommendation:</span>{" "}
                        {item.data.recommendation}
                      </p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-700">
                          Amount: ₱{item.data.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


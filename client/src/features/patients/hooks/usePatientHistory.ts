import { useState, useEffect } from "react";
import patientService from "@/features/patients/services/patientService";
import type { IPatient } from "@/features/patients/types";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

export function usePatientHistory(patientId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [medCerts, setMedCerts] = useState<IMedCert[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await patientService.getPatientHistory(patientId);
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
  }, [patientId]);

  const refreshHistory = async () => {
    if (!patientId) return;
    try {
      const data = await patientService.getPatientHistory(patientId);
      setPatient(data.patient);
      setPrescriptions(data.prescriptions);
      setMedCerts(data.medCerts);
    } catch (err) {
      console.error("Error refreshing patient history:", err);
    }
  };

  return {
    isLoading,
    error,
    patient,
    prescriptions,
    medCerts,
    refreshHistory,
  };
}



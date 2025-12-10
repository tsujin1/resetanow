import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddPatientDialog from "@/components/features/patients/AddPatientDialog";
import PatientHeader from "@/components/features/patients/PatientHeader";
import PatientStatsCards from "@/components/features/patients/PatientStatsCards";
import PatientSearchBar from "@/components/features/patients/PatientSearchBar";
import PatientTable from "@/components/features/patients/PatientTable";
import patientService from "@/services/patientService";
import type { IPatient } from "@/types";

export default function Patients() {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients function
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load patients";
      setError(errorMessage);
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPatients();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchPatients]);

  // Refresh patients list (can be called after adding/updating/deleting)
  const refreshPatients = useCallback(async () => {
    await fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <React.Fragment>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* --- HEADER ACTIONS --- */}
        <PatientHeader onPatientAdded={refreshPatients} />

        {/* --- ERROR STATE --- */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* --- STATS CARDS --- */}
        <PatientStatsCards patients={patients} isLoading={isLoading} />

        {/* --- SEARCH & TABLE --- */}
        <div className="space-y-4">
          <PatientSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            resultCount={filteredPatients.length}
          />
          <PatientTable
            patients={patients}
            filteredPatients={filteredPatients}
            isLoading={isLoading}
            onPatientDeleted={refreshPatients}
          />
        </div>

        {/* MOBILE BUTTON: Visible on mobile, Hidden on desktop */}
        <div className="mt-8 block sm:hidden pb-10">
          <AddPatientDialog
            className="w-full"
            onPatientAdded={refreshPatients}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

import { apiClient, AxiosError } from "@/shared/lib/apiClient";
import type { IPatient } from "@/features/patients/types";
import type { IPrescription } from "@/features/prescriptions/types";
import type { IMedCert } from "@/features/medcert/types";

// --- Patient Services ---

/**
 * Fetch all patients for the authenticated doctor
 */
const getPatients = async (): Promise<IPatient[]> => {
  try {
    const response = await apiClient.get("patients", {
      params: { _t: Date.now() },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch patients",
      );
    }
    throw error;
  }
};

/**
 * Fetch a single patient by ID
 */
const getPatientById = async (id: string): Promise<IPatient> => {
  try {
    const response = await apiClient.get(`patients/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch patient",
      );
    }
    throw error;
  }
};

/**
 * Create a new patient
 */
const createPatient = async (
  patientData: Omit<IPatient, "_id" | "lastVisit">,
): Promise<IPatient> => {
  try {
    const response = await apiClient.post("patients", patientData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create patient",
      );
    }
    throw error;
  }
};

/**
 * Update an existing patient
 */
const updatePatient = async (
  id: string,
  patientData: Partial<IPatient>,
): Promise<IPatient> => {
  try {
    const response = await apiClient.put(`patients/${id}`, patientData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update patient",
      );
    }
    throw error;
  }
};

/**
 * Delete a patient
 */
const deletePatient = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`patients/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete patient",
      );
    }
    throw error;
  }
};

/**
 * Get patient history (prescriptions and medical certificates)
 */
const getPatientHistory = async (
  id: string,
): Promise<{
  patient: IPatient;
  prescriptions: IPrescription[];
  medCerts: IMedCert[];
}> => {
  try {
    const response = await apiClient.get(`patients/${id}/history`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle connection errors
      if (
        error.code === "ECONNREFUSED" ||
        error.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        throw new Error(
          "Cannot connect to server. Please make sure the server is running.",
        );
      }
      // Handle HTTP errors
      if (error.response) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch patient history",
        );
      }
      // Handle network errors
      throw new Error(
        error.message || "Network error. Please check your connection.",
      );
    }
    throw error;
  }
};

const patientService = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientHistory,
};

export default patientService;

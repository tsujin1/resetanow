import axios, { AxiosError } from "axios";
import type { IPatient } from "@/types";

const API_URL = "http://localhost:5000/api/";

// --- Private Helpers ---
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getConfig = () => {
  const user = getStoredUser();
  if (!user?.token) throw new Error("No auth token found");

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  };
};

// --- Patient Services ---

/**
 * Fetch all patients for the authenticated doctor
 */
const getPatients = async (): Promise<IPatient[]> => {
  try {
    const response = await axios.get(API_URL + "patients", {
      ...getConfig(),
      params: { _t: Date.now() }, // Cache busting query parameter
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        // No patients found, return empty array
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
    const response = await axios.get(API_URL + `patients/${id}`, getConfig());
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
    const response = await axios.post(
      API_URL + "patients",
      patientData,
      getConfig(),
    );
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
    const response = await axios.put(
      API_URL + `patients/${id}`,
      patientData,
      getConfig(),
    );
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
    await axios.delete(API_URL + `patients/${id}`, getConfig());
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete patient",
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
};

export default patientService;

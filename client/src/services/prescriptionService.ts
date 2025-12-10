import axios, { AxiosError } from "axios";
import type { IPrescription } from "@/types";

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
    },
  };
};

// --- Prescription Services ---

/**
 * Fetch all prescriptions for the authenticated doctor
 */
const getPrescriptions = async (): Promise<IPrescription[]> => {
  try {
    const response = await axios.get(API_URL + "prescriptions", getConfig());
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        // No prescriptions found, return empty array
        return [];
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch prescriptions",
      );
    }
    throw error;
  }
};

/**
 * Fetch a single prescription by ID
 */
const getPrescriptionById = async (id: string): Promise<IPrescription> => {
  try {
    const response = await axios.get(
      API_URL + `prescriptions/${id}`,
      getConfig(),
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch prescription",
      );
    }
    throw error;
  }
};

/**
 * Create a new prescription
 */
const createPrescription = async (
  prescriptionData: Omit<IPrescription, "_id" | "createdAt">,
): Promise<IPrescription> => {
  try {
    const response = await axios.post(
      API_URL + "prescriptions",
      prescriptionData,
      getConfig(),
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create prescription",
      );
    }
    throw error;
  }
};

/**
 * Update an existing prescription
 */
const updatePrescription = async (
  id: string,
  prescriptionData: Partial<IPrescription>,
): Promise<IPrescription> => {
  try {
    const response = await axios.put(
      API_URL + `prescriptions/${id}`,
      prescriptionData,
      getConfig(),
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update prescription",
      );
    }
    throw error;
  }
};

/**
 * Delete a prescription
 */
const deletePrescription = async (id: string): Promise<void> => {
  try {
    await axios.delete(API_URL + `prescriptions/${id}`, getConfig());
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete prescription",
      );
    }
    throw error;
  }
};

const prescriptionService = {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
};

export default prescriptionService;


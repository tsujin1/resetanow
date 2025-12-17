import { apiClient, AxiosError } from "@/shared/lib/apiClient";
import type { IPrescription } from "@/features/prescriptions/types";

// --- Prescription Services ---

/**
 * Fetch all prescriptions for the authenticated doctor
 */
const getPrescriptions = async (): Promise<IPrescription[]> => {
  try {
    const response = await apiClient.get("prescriptions");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
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
    const response = await apiClient.get(`prescriptions/${id}`);
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
    const response = await apiClient.post("prescriptions", prescriptionData);
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
    const response = await apiClient.put(
      `prescriptions/${id}`,
      prescriptionData,
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
    await apiClient.delete(`prescriptions/${id}`);
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

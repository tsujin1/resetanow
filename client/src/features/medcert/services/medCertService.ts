import { apiClient, AxiosError } from "@/shared/lib/apiClient";
import type { IMedCert } from "@/features/medcert/types";

// --- Medical Certificate Services ---

/**
 * Fetch all medical certificates for the authenticated doctor
 */
const getMedCerts = async (): Promise<IMedCert[]> => {
  try {
    const response = await apiClient.get("medcerts", {
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
        error.response?.data?.message || "Failed to fetch medical certificates",
      );
    }
    throw error;
  }
};

/**
 * Fetch a single medical certificate by ID
 */
const getMedCertById = async (id: string): Promise<IMedCert> => {
  try {
    const response = await apiClient.get(`medcerts/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch medical certificate",
      );
    }
    throw error;
  }
};

/**
 * Create a new medical certificate
 */
const createMedCert = async (
  medCertData: Omit<IMedCert, "_id" | "createdAt">,
): Promise<IMedCert> => {
  try {
    const response = await apiClient.post("medcerts", medCertData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create medical certificate",
      );
    }
    throw error;
  }
};

/**
 * Update an existing medical certificate
 */
const updateMedCert = async (
  id: string,
  medCertData: Partial<IMedCert>,
): Promise<IMedCert> => {
  try {
    const response = await apiClient.put(`medcerts/${id}`, medCertData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update medical certificate",
      );
    }
    throw error;
  }
};

/**
 * Delete a medical certificate
 */
const deleteMedCert = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`medcerts/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete medical certificate",
      );
    }
    throw error;
  }
};

const medCertService = {
  getMedCerts,
  getMedCertById,
  createMedCert,
  updateMedCert,
  deleteMedCert,
};

export default medCertService;

import axios, { AxiosError } from "axios";
import type { IMedCert } from "@/features/medcert/types";

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

// --- Medical Certificate Services ---

/**
 * Fetch all medical certificates for the authenticated doctor
 */
const getMedCerts = async (): Promise<IMedCert[]> => {
  try {
    const response = await axios.get(API_URL + "medcerts", {
      ...getConfig(),
      params: { _t: Date.now() }, // Cache busting query parameter
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        // No med certs found, return empty array
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
    const response = await axios.get(API_URL + `medcerts/${id}`, getConfig());
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
    const response = await axios.post(
      API_URL + "medcerts",
      medCertData,
      getConfig(),
    );
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
    const response = await axios.put(
      API_URL + `medcerts/${id}`,
      medCertData,
      getConfig(),
    );
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
    await axios.delete(API_URL + `medcerts/${id}`, getConfig());
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

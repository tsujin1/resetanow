import {
  apiClient,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  AxiosError,
} from "@/shared/lib/apiClient";
import type { IDoctor } from "@/features/settings/types";

interface LoginData {
  email: string;
  password: string;
}

const register = async (userData: Partial<IDoctor>) => {
  const response = await apiClient.post("auth/register", userData);
  if (response.data) setStoredUser(response.data);
  return response.data;
};

const login = async (userData: LoginData) => {
  const response = await apiClient.post("auth/login", userData);
  if (response.data) setStoredUser(response.data);
  return response.data;
};

const logout = () => {
  removeStoredUser();
};

const getProfile = async () => {
  try {
    const response = await apiClient.get("auth/profile");
    const user = getStoredUser();
    if (user) {
      setStoredUser({ ...user, ...response.data });
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      const user = getStoredUser();
      if (user) {
        return {
          title: "",
          role: "",
          contactNumber: "",
          clinicAddress: "",
          clinicAvailability: "",
          licenseNo: "",
          ptrNo: "",
          s2No: "",
          signatureUrl: "",
          ...user,
        };
      }
    }
    throw error;
  }
};

const updateProfile = async (data: Partial<IDoctor>) => {
  try {
    const response = await apiClient.put("auth/profile", data);
    const user = getStoredUser();
    if (user) {
      setStoredUser({ ...user, ...response.data });
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      const user = getStoredUser();
      if (user) {
        const updatedUser = { ...user, ...data };
        setStoredUser(updatedUser);
        return updatedUser;
      }
    }
    throw error;
  }
};

const forgotPassword = async (email: string) => {
  const response = await apiClient.post("auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (
  token: string,
  email: string,
  password: string,
) => {
  const response = await apiClient.post("auth/reset-password", {
    token,
    email,
    password,
  });
  return response.data;
};

const deleteAccount = async (password: string) => {
  try {
    const response = await apiClient.delete("auth/account", {
      data: { password },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete account",
      );
    }
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  deleteAccount,
};

export default authService;

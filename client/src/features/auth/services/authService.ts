import axios, { AxiosError } from "axios";
import type { IDoctor } from "@/features/settings/types";

const API_URL = "http://localhost:5000/api/";

interface LoginData {
  email: string;
  password: string;
}

// --- Private Helpers ---
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (data: unknown) => {
  localStorage.setItem("user", JSON.stringify(data));
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

// --- Auth Services ---
const register = async (userData: Partial<IDoctor>) => {
  const response = await axios.post(API_URL + "auth/register", userData);
  if (response.data) setStoredUser(response.data);
  return response.data;
};

const login = async (userData: LoginData) => {
  const response = await axios.post(API_URL + "auth/login", userData);
  if (response.data) setStoredUser(response.data);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getProfile = async () => {
  try {
    const response = await axios.get(API_URL + "auth/profile", getConfig());

    const user = getStoredUser();
    if (user) {
      setStoredUser({ ...user, ...response.data });
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      const user = getStoredUser();
      if (user) {
        // Return stored user with all default fields to prevent UI errors
        return {
          title: "",
          role: "",
          contactNumber: "",
          clinicAddress: "",
          clinicAvailability: "", // <--- ADDED HERE
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
    const response = await axios.put(
      API_URL + "auth/profile",
      data,
      getConfig(),
    );

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
  const response = await axios.post(API_URL + "auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token: string, email: string, password: string) => {
  const response = await axios.post(API_URL + "auth/reset-password", {
    token,
    email,
    password,
  });
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
};

export default authService;

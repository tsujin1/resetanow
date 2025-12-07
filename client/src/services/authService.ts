import axios, { AxiosError } from "axios";
import type { IDoctor } from "@/types";

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

// FIX: Change 'any' to 'unknown'
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
    const response = await axios.put(API_URL + "auth/profile", data, getConfig());

    const user = getStoredUser();
    if (user) setStoredUser({ ...user, ...data });

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

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};

export default authService;
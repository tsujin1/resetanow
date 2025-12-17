import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Get the API base URL from environment variables
 */
const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return url.endsWith("/") ? url : url + "/";
};

/**
 * Get stored user data from localStorage
 */
export const getStoredUser = (): {
  token?: string;
  [key: string]: unknown;
} | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Set user data in localStorage
 */
export const setStoredUser = (data: unknown): void => {
  localStorage.setItem("user", JSON.stringify(data));
};

/**
 * Remove user data from localStorage
 */
export const removeStoredUser = (): void => {
  localStorage.removeItem("user");
};

/**
 * Create and configure axios instance with interceptors
 */
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: Inject auth token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const user = getStoredUser();
      if (user?.token && config.headers) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor: Handle common errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        removeStoredUser();
        // Optionally redirect to login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};

// Export the configured API client instance
export const apiClient = createApiClient();

// Export AxiosError for use in services (as a value for instanceof checks)
export { AxiosError };

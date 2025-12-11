/* eslint-disable no-undef */
import { createContext, useState, useEffect, type ReactNode } from "react";
import authService from "@/features/auth/services/authService";
import type { IDoctor } from "@/features/settings/types";

// 1. Define the Context Type strictly
interface AuthContextType {
  user: IDoctor | null;
  setUser: React.Dispatch<React.SetStateAction<IDoctor | null>>; // Add this
  isLoading: boolean;
  isError: boolean;
  message: string;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Create context - exported separately to avoid Fast Refresh issues
const AuthContext = createContext<AuthContextType | null>(null);

// Export context for use in components
export { AuthContext };

// Provider component - default export for Fast Refresh compatibility
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check auth on mount
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  // Validate token and get user on mount
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setIsLoading(false);
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem("user");
          setIsLoading(false);
          return;
        }

        // Validate that user object has required fields
        if (!parsedUser?.token || !parsedUser?.email || !parsedUser?._id) {
          // Invalid user structure, clear storage
          localStorage.removeItem("user");
          setIsLoading(false);
          return;
        }

        // Verify token with server - this will fail if token is invalid/expired
        const userData = await authService.getProfile();
        if (userData && userData._id && userData.email) {
          // Valid authenticated user
          setUser(userData);
        } else {
          // Invalid response from server
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        // Token is invalid, expired, or server error
        console.error("Auth validation failed:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  // Add this refreshUser method
  const refreshUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const updatedUser = localStorage.getItem("user");
        if (updatedUser) {
          setUser(JSON.parse(updatedUser));
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // Login Function
  const login = async (userData: { email: string; password: string }) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await authService.login(userData);
      // Validate response has required fields
      if (!data || !data.token || !data._id || !data.email) {
        throw new Error("Invalid login response from server");
      }
      setUser(data);
    } catch (error: unknown) {
      setIsError(true);
      let msg = "Login failed";

      // Type Guard for Axios Error
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        msg = err.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      setMessage(msg);
      // Clear any invalid data
      localStorage.removeItem("user");
      setUser(null);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Add this to the provider value
        isLoading,
        isError,
        message,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useState, useEffect, type ReactNode } from "react";
import authService from "../services/authService";
import type { IDoctor } from "@/types";

// 1. Define the Context Type strictly
interface AuthContextType {
  user: IDoctor | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// FIX: Silence the Fast Refresh warning for this specific export
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  // Check LocalStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login Function
  const login = async (userData: { email: string; password: string }) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await authService.login(userData);
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
    <AuthContext.Provider value={{ user, isLoading, isError, message, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
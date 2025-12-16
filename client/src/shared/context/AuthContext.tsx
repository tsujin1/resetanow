import { createContext, useState, useEffect, type ReactNode } from "react";
import authService from "@/features/auth/services/authService";
import type { IDoctor } from "@/features/settings/types";

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

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check auth on mount
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

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
          localStorage.removeItem("user");
          setIsLoading(false);
          return;
        }

        if (!parsedUser?.token || !parsedUser?.email || !parsedUser?._id) {
          localStorage.removeItem("user");
          setIsLoading(false);
          return;
        }

        const userData = await authService.getProfile();
        if (userData && userData._id && userData.email) {
          setUser(userData);
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth validation failed:", error);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

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

  const login = async (userData: { email: string; password: string }) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await authService.login(userData);
      if (!data || !data.token || !data._id || !data.email) {
        throw new Error("Invalid login response from server");
      }
      setUser(data);
    } catch (error: unknown) {
      setIsError(true);
      let msg = "Login failed";

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        msg = err.response?.data?.message || msg;
      } else if (error instanceof Error) {
        msg = error.message;
      }

      setMessage(msg);
      localStorage.removeItem("user");
      setUser(null);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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

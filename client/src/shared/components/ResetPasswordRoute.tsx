import { useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthContext } from "@/shared/context/AuthContext";

interface ResetPasswordRouteProps {
  children: ReactNode;
}

export default function ResetPasswordRoute({
  children,
}: ResetPasswordRouteProps) {
  const { user, isLoading } = useContext(AuthContext)!;
  const [searchParams] = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const validateToken = () => {
      // If user is logged in, don't allow access to reset password
      if (user) {
        setIsValidating(false);
        return;
      }

      // Check if token and email are present
      if (!token || !email) {
        setIsValidating(false);
        setIsTokenValid(false);
        return;
      }

      // Basic validation - token and email format check
      // The actual token validation happens when user submits the form
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && token.length > 0) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
      }
      setIsValidating(false);
    };

    if (!isLoading) {
      validateToken();
    }
  }, [isLoading, user, token, email]);

  // Show loading while checking auth or validating token
  if (isLoading || isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard (they don't need to reset password)
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If token or email is missing or invalid, redirect to login with error message
  if (!token || !email || !isTokenValid) {
    return <Navigate to="/login?error=invalid_reset_link" replace />;
  }

  // Token and email are present and valid, allow access to reset password page
  return <>{children}</>;
}

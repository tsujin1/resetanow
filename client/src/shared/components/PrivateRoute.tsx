import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthContext } from "@/shared/context/AuthContext";

export default function PrivateRoute() {
  const { user, isLoading } = useContext(AuthContext)!;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the child routes (Outlet).
  // If not, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

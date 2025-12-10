import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function PrivateRoute() {
  const { user } = useContext(AuthContext)!;

  // If user is logged in, show the child routes (Outlet).
  // If not, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AuthLayout from "@/shared/layouts/AuthLayout";
import AppLayout from "@/shared/layouts/AppLayout";
import PrivateRoute from "@/shared/components/PrivateRoute";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Patients from "@/features/patients/pages/Patients";
import PatientHistory from "@/features/patients/pages/PatientHistory";
import CreateRx from "@/features/prescriptions/pages/CreateRx";
import CreateMedCert from "@/features/medcert/pages/CreateMedCert";
import Settings from "@/features/settings/pages/Settings";

function App() {
  return (
    <>
      {/* <Router> is removed here because it is already in main.tsx */}
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private Application Routes - Protected by PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id/history" element={<PatientHistory />} />
            <Route path="/create-rx" element={<CreateRx />} />
            <Route path="/create-mc" element={<CreateMedCert />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Redirect root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Toaster placed here to be accessible globally */}
      <Toaster
        position="top-right"
        richColors={false} // ← Disable richColors to use custom styles
        toastOptions={{
          className:
            "border-slate-200 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700",
        }}
      />
    </>
  );
}

export default App;

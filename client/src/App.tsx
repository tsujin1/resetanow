import { Routes, Route, Navigate } from "react-router-dom"; // Removed 'BrowserRouter as Router'
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import CreateRx from "./pages/CreateRx";
import CreateMedCert from "./pages/CreateMedCert";
import Settings from "./pages/Settings";
import Register from "./pages/Register";

function App() {
  return (
    /* <Router> is removed here because it is already in main.tsx */
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private Application Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/create-rx" element={<CreateRx />} />
        <Route path="/med-cert" element={<CreateMedCert />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Redirect root to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout"; // Import this
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // Import this
import Patients from "./pages/Patients";
import CreateRx from "./pages/CreateRx"; // Import this
import CreateMedCert from "./pages/CreateMedCert"; // Import this 
import Settings from "./pages/Settings"; // Import this

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private Application Routes */}
        <Route element={<AppLayout />}>
           {/* This is where the Dashboard lives */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/create-rx" element={<CreateRx />} />
          <Route path="/med-cert" element={<CreateMedCert />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirect root to Dashboard for now */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { AuthContext } from "@/shared/context/AuthContext";
import dashboardImage from "@/assets/images/dashboard.png";

export default function AuthLayout() {
  const { user, isLoading } = useContext(AuthContext)!;

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* LEFT SIDE: Form Area */}
      <div className="relative flex h-full flex-col justify-between bg-white p-8 md:p-12 lg:p-16 z-10">
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="hidden md:block">ResetaNow</span>
        </div>

        {/* Form Container */}
        <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6 py-12">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center md:text-left text-sm text-slate-500">
          © 2025 ResetaNow. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Dashboard Preview */}
      <div className="hidden lg:block relative h-full w-full overflow-hidden bg-slate-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 h-full w-full opacity-[0.4] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* Dashboard Image */}
        <div className="absolute right-0 top-[12rem] h-[calc(100vh-12rem)] w-[92%] overflow-hidden rounded-l-[2.5rem] border border-r-0 border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
          <img
            src={dashboardImage}
            alt="Dashboard Preview"
            className="h-full w-full object-cover object-left-top transition-transform duration-700 hover:scale-[1.02]"
          />

          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.05)] pointer-events-none rounded-l-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}

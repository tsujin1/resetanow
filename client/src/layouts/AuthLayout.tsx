import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-4 space-y-4">
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ResetaNow</h1>
        </div>
        
        {/* The Login/Register forms will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
}
import { useContext } from "react";
import { LayoutDashboard, Users, Settings, LogOut, Pill, FileBadge, Activity } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext"; // Import Context

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Create Rx", href: "/create-rx", icon: Pill },
  { label: "Medical Cert", href: "/med-cert", icon: FileBadge },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const { logout, user } = useContext(AuthContext)!; // Get user data & logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear local storage & context
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex flex-col h-screen border-r bg-gradient-to-b from-slate-50 to-white w-64 shadow-sm">
      {/* Header / Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ResetaNow</h1>
        </div>
        <p className="text-xs text-slate-500 ml-10">Clinical Workflow System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5"
              )
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-slate-200">
        
        {/* Dynamic User Info */}
        <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
                {/* Get first initial of name, default to 'D' */}
                {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900 leading-none">
                    {user?.name || "Doctor"}
                </p>
                <p className="truncate text-xs text-slate-500 mt-1">
                    {user?.email || "doctor@clinic.com"}
                </p>
            </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
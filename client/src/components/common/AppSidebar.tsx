import { LayoutDashboard, Users, Settings, LogOut, Pill, FileBadge, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Create Rx", href: "/create-rx", icon: Pill },
  { label: "Medical Cert", href: "/med-cert", icon: FileBadge },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
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

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
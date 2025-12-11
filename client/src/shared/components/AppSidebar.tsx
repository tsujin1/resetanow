import { useContext, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Pill,
  FileBadge,
  Activity,
  Menu,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/shared/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Import Sheet

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Create Prescription", href: "/create-rx", icon: Pill },
  { label: "Medical Certificate", href: "/create-mc", icon: FileBadge },
  { label: "Settings", href: "/settings", icon: Settings },
];

// 1. Reusable Content Component (Used by both Desktop and Mobile)
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { logout, user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ResetaNow
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-10">Clinical Workflow System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose} // Close mobile menu when link is clicked
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
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
};

// 2. Desktop Sidebar (Hidden on Mobile)
export default function AppSidebar() {
  return (
    <div className="hidden md:flex flex-col h-screen w-64 border-r shadow-sm fixed left-0 top-0">
      <SidebarContent />
    </div>
  );
}

// 3. Mobile Navbar / Trigger (Visible on Mobile Only)
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden m-2 text-slate-700"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <SidebarContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

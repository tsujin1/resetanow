import { Outlet } from "react-router-dom";
import { Activity } from "lucide-react";
import AppSidebar, { MobileSidebar } from "@/components/common/AppSidebar"; // Import both

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      {/* IMPORTANT: Added 'md:ml-64' to push content right on desktop */}
      <main className="flex-1 flex flex-col h-full overflow-hidden md:ml-64 transition-all duration-300">
        {/* Header - Mobile Only */}
        <header className="h-16 border-b bg-white flex items-center px-4 md:hidden shrink-0 z-20">
          {/* Logo */}
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>

          {/* Push the menu button to the right */}
          <div className="ml-auto">
            <MobileSidebar />
          </div>
        </header>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-auto p-4 md:p-6 relative z-10">
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

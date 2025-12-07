import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/common/AppSidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile for now (we can add a mobile drawer later) */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Optional: For breadcrumbs or user profile in top right) */}
        <header className="h-16 border-b bg-white flex items-center px-6 md:hidden">
          <span className="font-bold">ResetaNow</span>
          {/* Mobile menu trigger would go here */}
        </header>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 overflow-auto p-4 md:p-6"> {/* Reduced padding */}
          <div className="mx-auto w-full"> {/* Removed max-width constraint */}
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
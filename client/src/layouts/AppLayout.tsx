import { Outlet } from "react-router-dom";
import AppSidebar, { MobileSidebar } from "@/components/common/AppSidebar"; // Import both

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Desktop Sidebar 
        (The AppSidebar component from the previous step is 'fixed', 
        so it sits on top of the layout on the left side)
      */}
      <AppSidebar />

      {/* Main Content Area */}
      {/* IMPORTANT: Added 'md:ml-64' to push content right on desktop */}
      <main className="flex-1 flex flex-col h-full overflow-hidden md:ml-64 transition-all duration-300">
        
        {/* Header - Mobile Only */}
        <header className="h-16 border-b bg-white flex items-center px-4 md:hidden shrink-0 z-20 relative">
          {/* 1. Mobile Menu Trigger */}
          <MobileSidebar />
          
          <span className="font-bold text-lg ml-2 text-slate-900">ResetaNow</span>
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
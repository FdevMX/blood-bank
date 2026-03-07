"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Session } from "next-auth";

interface DashboardShellProps {
  children: React.ReactNode;
  session: Session | null;
}

export function DashboardShell({ children, session }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuClosed, setDesktopMenuClosed] = useState(false);

  const toggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setDesktopMenuClosed(!desktopMenuClosed);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Oculto en impresión */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out print:hidden h-full shrink-0 shadow-2xl lg:shadow-none lg:relative
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          ${desktopMenuClosed ? "lg:-ml-[260px]" : "lg:ml-0 lg:translate-x-0"}
        `}
      >
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden w-full print:block print:h-auto print:overflow-visible relative z-10 bg-background">
        {/* Header - Oculto en impresión */}
        <div className="print:hidden">
          <Header session={session} onMenuClick={toggleMenu} />
        </div>
        
        <main className="flex-1 overflow-y-auto print:static print:block print:h-auto print:overflow-visible">
          <div className="p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto print:p-0 print:m-0 print:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

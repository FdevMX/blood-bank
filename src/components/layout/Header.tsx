"use client";

import { Session } from "next-auth";
import { Bell, Search, Sparkles, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  session: Session | null;
  onMenuClick?: () => void;
}

export function Header({ session, onMenuClick }: HeaderProps) {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDateStr(now.toLocaleDateString("es-HN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 bg-background/80 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-md hover:bg-white/5 text-muted-foreground hover:text-white transition-colors border border-border/10 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-muted-foreground capitalize hidden sm:block font-medium">{dateStr}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-9 items-center gap-2 rounded-full bg-[#1a1210]/[0.04] px-4 text-sm text-muted-foreground hover:bg-[#1a1210]/[0.08] transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-[13px]">Buscar...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center rounded-md bg-white px-1.5 text-[10px] font-mono text-muted-foreground shadow-sm">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-full bg-[#1a1210]/[0.04] flex items-center justify-center text-muted-foreground hover:bg-[#1a1210]/[0.08] transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 anim-pulse-dot" />
        </button>

        {/* Clock */}
        <div className="hidden md:flex h-9 items-center rounded-full bg-[#1a1210] px-4">
          <span className="font-mono text-[13px] font-semibold text-white tabular-nums tracking-wider">{time}</span>
        </div>
      </div>
    </header>
  );
}

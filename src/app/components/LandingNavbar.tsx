"use client";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-black border-b-4 border-white">
      <div className="flex justify-between items-center w-full px-4 h-16 max-w-screen-2xl mx-auto">
        <div
          className="text-3xl font-bold tracking-tighter text-white font-landing-headline border-r-4 border-white h-full flex items-center px-6 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          B<span className="text-[#ef4444] ml-2">S</span>
        </div>
        <div className="hidden md:flex items-center h-full">
          <a className="px-6 h-full flex items-center border-r border-[#333] text-[#ef4444] bg-white/5 hover:bg-white/10 transition-colors" href="#inicio">INICIO</a>
          <a className="px-6 h-full flex items-center border-r border-[#333] hover:bg-white/10 transition-colors" href="#caracteristicas">MÓDULOS</a>
          <a className="px-6 h-full flex items-center border-r border-[#333] hover:bg-white/10 transition-colors" href="#proceso">PROTOCOLO</a>
          <a className="px-6 h-full flex items-center border-r border-[#333] hover:bg-white/10 transition-colors" href="#seguridad">SEGURIDAD</a>
        </div>
        <div className="flex items-center gap-0 h-full">
          <Link href="/login" className="px-8 h-full bg-[#ef4444] text-black font-bold font-landing-headline hover:bg-white transition-colors flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            ACCEDER
          </Link>
        </div>
      </div>
    </nav>
  );
}

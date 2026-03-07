"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Droplets, LogIn } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pt-6 px-6 pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-500 rounded-full border ${
          scrolled
            ? "bg-[#111111]/80 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3 px-6 w-full max-w-5xl"
            : "bg-transparent border-transparent py-4 px-6 w-full max-w-[1600px]"
        }`}
      >
        <div className="flex items-center justify-between w-full relative">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
               <Droplets className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">
              Banco de Sangre
            </span>
          </div>

          {/* Center Links (only show clearly if scrolled or space permits, keep simple) */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {[
              { id: "inicio", label: "Inicio" },
              { id: "caracteristicas", label: "Características" },
              { id: "proceso", label: "Protocolo" },
              { id: "seguridad", label: "Seguridad" },
            ].map((link) => (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                className="px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 lg:ml-auto">
            <Link href="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <LogIn className="w-4 h-4" />
              <span>Acceder</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

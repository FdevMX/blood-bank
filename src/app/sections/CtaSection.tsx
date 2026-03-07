"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ShieldCheck } from "lucide-react";

// Optional Vanta JS background (if previously installed/working)
const VantaBackground = dynamic(() => import("../components/VantaBackground").then((m) => m.VantaBackground), { 
  ssr: false,
});

export function CtaSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050505] p-6">
      
      {/* Vanta Animated Background */}
      <div className="absolute inset-0 opacity-40">
        <VantaBackground />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-0 pointer-events-none" />

      {/* Glassmorphic Central Card */}
      <div className="relative z-20 w-full max-w-4xl text-center flex flex-col items-center p-8 md:p-12 lg:p-20 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-[0_8px_40px_rgba(0,0,0,0.6)] mx-4 md:mx-auto"
           style={{
             background: "rgba(20, 15, 15, 0.4)",
             backdropFilter: "blur(40px)",
             WebkitBackdropFilter: "blur(40px)"
           }}>
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full mb-10 bg-white/5 border border-white/10 shadow-inner">
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
           <span className="text-sm font-bold tracking-wide text-white uppercase">Acceso Restringido</span>
        </div>

        {/* Clean, Non-exaggerated Title */}
        <h2 className="text-3xl md:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-8 tracking-tight">
          Entorno de Control <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Inteligente</span>
        </h2>

        {/* Smooth Subtitle */}
        <p className="text-sm md:text-lg text-white/50 mb-10 md:mb-14 max-w-2xl leading-relaxed font-light mx-auto inline-block">
          Ingresa con credenciales autorizadas para gestionar el inventario, revisar logs de auditoría inmutables y controlar todos los módulos de donantes.
        </p>
        
        {/* Soft, rounded Button */}
        <Link href="/login"
            className="group relative px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-base md:text-lg font-bold rounded-full md:rounded-[2rem] overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center gap-3 md:gap-4 mx-auto"
          >
            <span className="relative z-10 transition-colors">Confirmar Identidad</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
        </Link>
      </div>
    </section>
  );
}

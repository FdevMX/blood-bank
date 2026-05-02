"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { LandingNavbar } from "./components/LandingNavbar";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ProcessSection } from "./sections/ProcessSection";
import { DashboardSection } from "./sections/DashboardSection";
import { SecuritySection } from "./sections/SecuritySection";
import { CtaSection } from "./sections/CtaSection";
import { Droplets, Github, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LandingClient() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden font-landing-body uppercase">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[100]" />

      {/* Terminal Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)"
        }}
      />

      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <DashboardSection />
      <SecuritySection />
      <CtaSection />

      {/* Footer */}
      <footer className="bg-black p-8 lg:p-12 font-landing-body border-t border-[#333]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div>
            <div className="text-4xl font-landing-headline font-bold text-white mb-4">BANCO DE SANGRE</div>
            <p className="text-[10px] text-white/40 mb-2">
              © {new Date().getFullYear()} BANCO DE SANGRE. DESARROLLO OPEN SOURCE
            </p>
            <p className="text-[10px] text-white/40 flex items-center gap-2">
              CONSTRUIDO CON <Heart className="h-3 w-3 text-red-500/50" /> PARA SALVAR VIDAS
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <a className="text-white/40 hover:text-[#ef4444] underline transition-colors" href="#inicio">INICIO</a>
            <a className="text-white/40 hover:text-[#ef4444] underline transition-colors" href="#caracteristicas">CARACTERÍSTICAS</a>
            <a className="text-white/40 hover:text-[#ef4444] underline transition-colors" href="#proceso">PROTOCOLO</a>
            <a className="text-white/40 hover:text-[#ef4444] underline transition-colors" href="#seguridad">SEGURIDAD</a>
          </div>
          <div className="flex justify-start md:justify-end gap-6">
            <a href="https://github.com/fredmdz/blood-bank" target="_blank" rel="noopener noreferrer"
              className="w-12 h-12 border border-white flex items-center justify-center hover:border-[#ef4444] hover:text-[#ef4444] transition-colors cursor-pointer">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

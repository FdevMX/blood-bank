"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ProcessSection } from "./sections/ProcessSection";
import { TeamSection } from "./sections/TeamSection";
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
    <div className="min-h-screen bg-[#0e0907] text-white selection:bg-red-500/30 overflow-hidden font-sans">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <TeamSection />
      <SecuritySection />
      <CtaSection />
      
      {/* Footer */}
      <footer style={{ background: "#040201", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#ef4444,#b91c1c)" }}>
                <Droplets className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Banco de Sangre</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-7 text-sm font-semibold"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              {(["inicio","caracteristicas","equipo"] as const).map((id, i) => (
                <a key={id} href={`#${id}`} className="hover:text-white transition-colors">
                  {["Inicio","Características","Equipo"][i]}
                </a>
              ))}
              <a href="https://github.com/FdevMX/blood-bank" target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left" style={{ color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} Banco de Sangre. Desarrollo Open Source.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span>Construido con</span>
              <Heart className="h-4 w-4 text-red-500/50" />
              <span>para salvar vidas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


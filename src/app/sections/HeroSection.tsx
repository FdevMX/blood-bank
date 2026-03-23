"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title-brutalist", {
        y: 80,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".hero-badge", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.8,
      });
      gsap.from(".hero-btn", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.0,
      });
      gsap.from(".hero-image-area", {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(".hero-overlay-card", {
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(1.5)",
        delay: 1.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={containerRef} className="relative border-b-4 border-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Text Content */}
        <div className="p-8 lg:p-16 border-r-0 lg:border-r-4 border-white flex flex-col justify-center">
          <div className="hero-badge inline-block py-1 px-3 border border-[#ef4444] text-[#ef4444] font-landing-body text-xs mb-8 self-start">
            [SYSTEM_STATUS: PLATAFORMA_ACTIVA]
          </div>
          <h1 className="hero-title-brutalist text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-8 font-landing-headline">
            BANCO DE<br />
            <span className="text-[#ef4444]">SANGRE:</span><br />
            GESTIÓN INTELIGENTE
          </h1>
          <p className="hero-desc font-landing-body text-lg text-white/70 max-w-xl mb-12 leading-relaxed">
            PLATAFORMA CLÍNICA AVANZADA CON TRAZABILIDAD INMUTABLE, DISEÑO PARAMÉTRICO Y CONTROL ABSOLUTO DE DONANTES Y UNIDADES SANGUÍNEAS. DISEÑADA PARA SALVAR VIDAS.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/login"
              className="hero-btn border-2 border-white bg-white text-black text-xl font-landing-headline px-10 py-5 inline-flex items-center justify-center font-bold hover:bg-[#ef4444] hover:text-black hover:border-[#ef4444] transition-all duration-100 gap-3"
            >
              ACCEDER AL SISTEMA <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://github.com/FdevMX/blood-bank" target="_blank" rel="noopener noreferrer"
              className="hero-btn border-2 border-white text-xl font-landing-headline px-10 py-5 inline-flex items-center justify-center font-bold hover:bg-[#ef4444] hover:text-black hover:border-[#ef4444] transition-all duration-100 gap-3"
            >
              <Github className="w-5 h-5" /> VER EN GITHUB
            </a>
          </div>
        </div>

        {/* Right: Image Area */}
        <div className="hero-image-area bg-[#1A1A1A] p-4 flex items-center justify-center relative min-h-[500px]">
          <div className="absolute top-4 left-4 text-[10px] text-[#ef4444] font-landing-body">DASHBOARD_PREVIEW_001</div>
          <div className="w-full h-full border-2 border-white/20 p-2">
            {/* Dashboard Mockup Inside */}
            <div className="w-full h-full border border-white/10 bg-black p-6 flex flex-col gap-4">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-[#333] pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-2 bg-white/10 rounded-full" />
                  <div className="w-12 h-2 bg-white/10 rounded-full" />
                </div>
              </div>
              {/* Mockup Grid */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="bg-[#111] border border-[#333] p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-white/40">DONANTES ACTIVOS</span>
                  <span className="text-3xl font-landing-headline font-bold text-white">10,245</span>
                  <span className="text-[10px] text-[#ef4444] font-bold">[ +12% ESTE MES ]</span>
                </div>
                <div className="bg-[#111] border border-[#333] p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-white/40">UNIDADES LIBRES</span>
                  <span className="text-3xl font-landing-headline font-bold text-white">2,850</span>
                  <span className="text-[10px] text-emerald-500 font-bold">[ VERIFICADAS ]</span>
                </div>
                <div className="col-span-2 bg-[#111] border border-[#333] p-4">
                  <span className="text-[10px] text-white/40 mb-2 block">ÚLTIMAS LIBERACIONES</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/5 p-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#ef4444] text-xs">[O+]</span>
                        <span className="text-xs text-white/70">UID-893A &gt; DISPONIBLE</span>
                      </div>
                      <span className="text-xs text-emerald-500 font-bold">[OK]</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-500 text-xs">[AB-]</span>
                        <span className="text-xs text-white/70">UID-1B4F &gt; EN CUARENTENA</span>
                      </div>
                      <span className="text-xs text-amber-500 font-bold">[WAIT]</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#ef4444] text-xs">[A+]</span>
                        <span className="text-xs text-white/70">UID-9C21 &gt; DISPONIBLE</span>
                      </div>
                      <span className="text-xs text-emerald-500 font-bold">[OK]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Overlay badges */}
          <div className="hero-overlay-card absolute top-10 right-10 bg-black border-2 border-white p-4 font-landing-body">
            <div className="text-[10px] text-white/50 mb-1">GRUPO CRÍTICO</div>
            <div className="text-2xl font-bold text-[#ef4444] underline">O- NEGATIVO</div>
          </div>
          <div className="hero-overlay-card absolute bottom-10 left-10 bg-black border-2 border-[#ef4444] p-4 font-landing-body">
            <div className="text-3xl font-bold text-[#ef4444]">98%</div>
            <div className="text-[10px]">EFICIENCIA LOGÍSTICA</div>
          </div>
        </div>
      </div>
    </section>
  );
}

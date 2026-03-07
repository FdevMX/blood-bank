"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Activity, Droplets, Shield, Heart, Github } from "lucide-react";
import { ParticlesBackground } from "../components/ParticlesBackground";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const BloodDropCanvas = dynamic(() => import("../components/BloodDropCanvas"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Efecto Cortina Circular de Entrada
      gsap.from(".hero-overlay-curtain", {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.8,
        ease: "power3.inOut"
      });

      // Animación de textos
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        rotationX: -20,
        transformOrigin: "bottom",
        stagger: 0.1,
        duration: 1.2,
        ease: "back.out(1.2)",
        delay: 0.4
      });

      // Animación de Mockup 3D
      gsap.from(mockupRef.current, {
        y: 150,
        opacity: 0,
        rotationY: 15,
        rotationX: 10,
        scale: 0.9,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.8
      });

      // Floating anim para el mockup continuo
      gsap.to(mockupRef.current, {
        y: -15,
        rotationY: -2,
        rotationX: 5,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.3
      });
      
      // Detalles del mockup apareciendo
      gsap.from(".mockup-row", {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        delay: 1.5,
        ease: "power2.out"
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={containerRef} className="relative min-h-screen flex items-center px-4 md:px-6 lg:px-12 pt-24 md:pt-32 pb-16 md:pb-24 z-10 bg-[#050505] overflow-hidden">
      <div className="hero-overlay-curtain absolute inset-0 bg-[#0B0606] z-0" style={{ clipPath: "circle(150% at 50% 50%)" }} />
      <ParticlesBackground />
      
      {/* 3D Blood Drop Background */}
      <div className="absolute right-0 top-20 w-[60vw] h-[80vh] opacity-30 pointer-events-none mix-blend-screen">
         <BloodDropCanvas />
      </div>

      <div className="max-w-[1600px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        
        {/* Typographic & Call to Actions */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <a href="https://github.com/FdevMX/blood-bank" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
               style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", backdropFilter: "blur(12px)" }}>
            <Github className="h-4 w-4 text-white/70 group-hover:text-white" />
            <span className="text-sm font-bold text-white/80 tracking-wider uppercase group-hover:text-white">Proyecto Open Source en GitHub</span>
            <ArrowRight className="h-4 w-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <h1 className="text-4xl md:text-5xl sm:text-7xl xl:text-[6rem] font-bold tracking-tight leading-[1.1] md:leading-[1] text-white mb-4 md:mb-6" style={{ perspective: "1000px" }}>
            <div className="hero-title block">Gestión</div>
            <div className="hero-title block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Inteligente</div>
            <div className="hero-title block">Para Bancos.</div>
          </h1>
          
          <p className="text-base md:text-lg text-white/50 mb-8 md:mb-10 hero-title max-w-lg leading-relaxed font-light">
            Plataforma clínica avanzada con trazabilidad inmutable, diseño paramétrico, y control absoluto de donantes y unidades sanguíneas. Diseñada para salvar vidas.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 hero-title">
            <Link href="/login"
              className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <div className="relative z-10 flex items-center gap-3 justify-center text-sm md:text-base">
                Acceder al Sistema <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3D Glassmorphic Animated Mockup */}
        <div className="lg:col-span-6 mt-12 lg:mt-0 relative perspective-1000">
          <div ref={mockupRef} className="w-full max-w-2xl ml-auto rounded-[2.5rem] p-6 shadow-[0_0_80px_rgba(220,38,38,0.15)]"
               style={{ 
                 background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)", 
                 backdropFilter: "blur(20px)",
                 border: "1px solid rgba(255,255,255,0.1)",
                 transformStyle: "preserve-3d"
               }}>
            
            {/* Nav Mockup */}
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="ml-auto flex gap-4">
                <div className="w-20 h-2 bg-white/10 rounded-full" />
                <div className="w-12 h-2 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-[#110A0A] rounded-3xl p-5 border border-red-500/10 mockup-row relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                 <Activity className="w-5 h-5 md:w-6 md:h-6 text-red-500 mb-2 md:mb-4" />
                 <div className="text-2xl md:text-3xl font-bold text-white mb-1">10,245</div>
                 <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Donantes Activos</div>
               </div>
               <div className="bg-[#0A110F] rounded-3xl p-5 border border-emerald-500/10 mockup-row relative overflow-hidden group">
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                 <Shield className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 mb-2 md:mb-4" />
                 <div className="text-2xl md:text-3xl font-bold text-white mb-1">2,850</div>
                 <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Unidades Libres</div>
               </div>
            </div>

            {/* Table Mockup */}
            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="text-xs font-bold text-white/50 mb-4 uppercase tracking-widest">Últimas Liberaciones</div>
              {[
                { id: "UID-893A", group: "O+", status: "Disponible", color: "text-emerald-500" },
                { id: "UID-1B4F", group: "AB-", status: "En Cuarentena", color: "text-amber-500" },
                { id: "UID-9C21", group: "A+", status: "Disponible", color: "text-emerald-500" }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl mockup-row">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{row.group}</div>
                     <span className="text-sm font-mono text-white/70">{row.id}</span>
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${row.color}`}>{row.status}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

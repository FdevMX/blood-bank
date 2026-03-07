"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Code, Layout, Terminal } from "lucide-react";

export function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Float up effect
      gsap.from(".team-card-animate", {
        scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
        y: 80,
        opacity: 0,
        rotationY: -10,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out"
      });
      
      const cards = document.querySelectorAll(".team-card-animate");
      cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, rotationY: 0, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, rotationY: 0, duration: 0.4, ease: "power2.inOut" });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const team = [
    { name: "Gabriel H. Bruno", role: "Fullstack / Arquitecto", icon: Terminal, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Ana G. Casanova", role: "Frontend / UI Design", icon: Layout, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { name: "Alfredo Lopez", role: "Fullstack / Backend", icon: Code, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <section id="equipo" ref={sectionRef} className="py-20 md:py-32 bg-[#050202] px-4 md:px-6 lg:px-12 relative overflow-hidden perspective-1000">
      
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 relative z-10">
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
               style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
            <span className="text-xs md:text-sm font-bold tracking-widest text-white/50 uppercase">Operativa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6">
            Equipo<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Detrás del Código</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 leading-relaxed font-light">
            Ingenieros encargados de ensamblar la lógica profunda y la interfaz de esta aplicación central para el banco de sangre. Construyendo software robusto.
          </p>
        </div>
        
        <div className="w-full lg:w-3/5 team-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((t, i) => (
             <div key={i} className={`team-card-animate bg-[#0e0707] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border ${t.border} flex flex-col items-center justify-center text-center shadow-[0_4px_30px_rgba(0,0,0,0.3)] transform-style-3d cursor-default`}
                  style={{ backdropFilter: "blur(20px)" }}>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${t.bg} flex items-center justify-center mb-4 md:mb-6`}>
                   <t.icon className={`w-8 h-8 md:w-10 md:h-10 ${t.color}`} />
                </div>
                
                <h4 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">{t.name}</h4>
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
                  {t.role}
                </p>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}

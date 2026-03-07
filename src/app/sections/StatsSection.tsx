"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Users, Activity, Shield, Heart } from "lucide-react";

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Card Hover & Entrance
      gsap.fromTo(".stat-card-glass", 
        { y: 60, rotationX: -10, scale: 0.95, opacity: 0 },
        {
          scrollTrigger: { trigger: ".stats-container", start: "top 85%" },
          y: 0, 
          rotationX: 0,
          scale: 1,
          opacity: 1, 
          stagger: 0.1, 
          duration: 1.2, 
          ease: "power3.out"
        }
      );



      // Counter animation
      const numbers = document.querySelectorAll(".stat-num");
      numbers.forEach(el => {
        const endValueStr = el.getAttribute("data-value") || "0";
        const isFloat = endValueStr.includes(".");
        const endValue = parseFloat(endValueStr);
        
        gsap.to(el, {
          scrollTrigger: { trigger: ".stats-container", start: "top 80%" },
          innerHTML: endValue, 
          duration: 2, 
          ease: "power2.out", 
          snap: { innerHTML: isFloat ? 0.1 : 1 },
          onUpdate: function() {
            if(isFloat) {
                this.targets()[0].innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
            }
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Donantes Registrados", value: "10", suffix: "k+", icon: Users, color: "text-rose-500", bg: "bg-[#1A0B10]", glow: "from-rose-500/20" },
    { label: "Unidades en Inventario", value: "2.5", suffix: "k", icon: Activity, color: "text-blue-500", bg: "bg-[#0A101C]", glow: "from-blue-500/20" },
    { label: "Hospitales Conectados", value: "15", suffix: "", icon: Shield, color: "text-emerald-500", bg: "bg-[#0A1C14]", glow: "from-emerald-500/20" },
    { label: "Vidas Salvadas", value: "30", suffix: "k+", icon: Heart, color: "text-orange-500", bg: "bg-[#1A1005]", glow: "from-orange-500/20" },
  ];

  return (
    <section ref={sectionRef} className="bg-[#040202] py-16 md:py-32 relative overflow-hidden">
      
      {/* Subtle Background Orbs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 stats-container relative z-10 perspective-1000">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="stat-card-glass group flex flex-col items-center text-center px-4 md:px-6 py-8 md:py-12 rounded-[2rem] bg-[#0A0707] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.2)] relative overflow-hidden border border-white/5 hover:border-white/10">
              
              {/* Dark subtle gradient interior shading */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none z-0" />
              
              {/* Magic hover colorful illumination */}
              <div className={`absolute inset-0 bg-gradient-to-b ${s.glow} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 ease-in-out pointer-events-none z-0`} />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${s.bg} border border-white/5 flex items-center justify-center mb-6 md:mb-8 shadow-inner`}>
                   <s.icon className={`w-5 h-5 md:w-7 md:h-7 ${s.color}`} />
                </div>
                
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-3 tracking-tighter flex items-center justify-center">
                  <span className="stat-num" data-value={s.value}>0</span>
                  <span>{s.suffix}</span>
                </div>
                <div className="text-[10px] md:text-xs font-bold text-white/40 tracking-wide">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

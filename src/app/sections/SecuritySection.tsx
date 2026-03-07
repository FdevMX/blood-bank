"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Lock, ShieldCheck, FileText } from "lucide-react";

export function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Circle Entry Effect per Card
      gsap.from(".sec-card", {
        scrollTrigger: { trigger: ".sec-grid", start: "top 75%" },
        scale: 0.8,
        y: 60,
        opacity: 0, 
        stagger: 0.15, 
        duration: 1.2, 
        ease: "back.out(1.4)"
      });
      
      const cards = document.querySelectorAll(".sec-card");
      cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -10, rotationX: 5, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, rotationX: 0, duration: 0.4, ease: "power2.inOut" });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const items = [
    { title: "Autenticación Server-Side", desc: "Uso de sesiones estables. Contraseñas protegidas mediante algoritmos de hashing bcrypt.", icon: Lock, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Control Estricto (RBAC)", desc: "Middleware ejecutado en Edge runtime. Limitación geométrica de rutas por roles de usuario.", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Auditoría Inmutable", desc: "Cada movimiento impacta inmediatamente una tabla de logs inmutables con sellos de tiempo.", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  return (
    <section id="seguridad" ref={sectionRef} className="py-20 md:py-32 bg-[#080303] px-4 md:px-6 lg:px-12 relative overflow-hidden perspective-1000">
      
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
               style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", backdropFilter: "blur(12px)" }}>
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-xs md:text-sm font-bold tracking-widest text-red-100 uppercase">Seguridad e Infraestructura</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6">
            Bloqueo <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Rígido</span>
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            Privacidad total de la información médica. El servidor se protege a sí mismo a través de estándares criptográficos OWASP.
          </p>
        </div>

        <div className="sec-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
             <div key={i} className="sec-card bg-[#110A0A] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col items-start transform-style-3d border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:border-white/15 transition-colors duration-500 cursor-default"
                  style={{ backdropFilter: "blur(20px)" }}>
               
               <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${item.bg} flex items-center justify-center mb-6 md:mb-8 border border-white/5`}>
                 <item.icon className={`w-6 h-6 md:w-8 md:h-8 ${item.color}`} />
               </div>
               
               <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{item.title}</h3>
               <p className="text-white/40 leading-relaxed font-light text-xs md:text-sm">
                 {item.desc}
               </p>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}

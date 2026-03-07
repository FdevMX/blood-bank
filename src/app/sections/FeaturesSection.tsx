"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Users, Activity, BarChart3, Database, Shield, Lock } from "lucide-react";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Circle Entry Effect per Card
      gsap.from(".feat-card", {
        scrollTrigger: { trigger: ".feat-grid", start: "top 80%" },
        y: 80, 
        scale: 0.8,
        opacity: 0, 
        stagger: 0.15,
        duration: 1.2, 
        ease: "back.out(1.5)"
      });

      // Icon rotation effect
      const cards = document.querySelectorAll(".feat-card");
      cards.forEach(card => {
        const iconContainer = card.querySelector(".icon-container");
        card.addEventListener("mouseenter", () => {
          gsap.to(iconContainer, { rotation: 15, scale: 1.1, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(iconContainer, { rotation: 0, scale: 1, duration: 0.4, ease: "bounce.out" });
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const features = [
    { 
      icon: Users,
      title: "Gestión de Donantes", 
      desc: "Perfiles detallados con historial diferido y evaluaciones paramétricas completas.", 
      color: "from-rose-500/20 to-red-600/5",
      iconColor: "text-rose-500"
    },
    { 
      icon: Database,
      title: "Trazabilidad Total", 
      desc: "Seguimiento exhaustivo de cada unidad extraída mediante códigos criptográficos.", 
      color: "from-blue-500/20 to-indigo-600/5",
      iconColor: "text-blue-500"
    },
    { 
      icon: Activity,
      title: "Evaluación Médica", 
      desc: "Captura ágil de signos vitales como hemoglobina, presión y peso en tiempo real.", 
      color: "from-emerald-500/20 to-teal-600/5",
      iconColor: "text-emerald-500"
    },
    { 
      icon: Shield,
      title: "Liberación Segura", 
      desc: "Validación estricta de pruebas serológicas antes de asignar el estado 'Disponible'.", 
      color: "from-amber-500/20 to-orange-600/5",
      iconColor: "text-amber-500"
    },
    { 
      icon: BarChart3,
      title: "Métricas y Análisis", 
      desc: "Dashboards con la composición y déficits del inventario sanguíneo general.", 
      color: "from-purple-500/20 to-fuchsia-600/5",
      iconColor: "text-purple-500"
    },
    { 
      icon: Lock,
      title: "Auditoría en Tiempo Real", 
      desc: "Logs inmutables para cada movimiento o acceso al sistema, garantizando seguridad.", 
      color: "from-zinc-500/20 to-gray-600/5",
      iconColor: "text-zinc-400"
    },
  ];

  return (
    <section id="caracteristicas" ref={sectionRef} className="py-20 md:py-32 bg-[#050505] relative px-4 md:px-6 lg:px-12 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1600px] w-full mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
               style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
            <Activity className="w-4 h-4 text-white/50" />
            <span className="text-sm font-bold tracking-widest text-white/50 uppercase">Módulos Estratégicos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6">
            Todo el control en un 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300 ml-2 md:ml-3">Ecosistema.</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            Funcionalidades de infraestructura crítica encapsuladas en una interfaz 
            amigable, responsiva y diseñada con los más altos estándares visuales.
          </p>
        </div>

        <div className="feat-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="feat-card bg-[#0A0A0A] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5 hover:border-white/10 transition-colors duration-500"
                 style={{ backdropFilter: "blur(20px)" }}>
              {/* Magic gradient background reveal on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out`} />
              
              <div className="relative z-10">
                <div className="icon-container w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-center mb-6 md:mb-8 shadow-inner">
                  <f.icon className={`w-6 h-6 md:w-8 md:h-8 ${f.iconColor}`} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{f.title}</h3>
                <p className="text-white/40 leading-relaxed font-light text-xs md:text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

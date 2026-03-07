"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsCount = 4;

  useEffect(() => {
    // Auto-play the steps every 3.5 seconds
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsCount);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { title: "Admisión del Donante", desc: "Registro ágil validando identificación física y revisando instantáneamente el historial de diferimientos." },
    { title: "Evaluación Clínica", desc: "Toma de signos vitales como hemoglobina, presión y pulso, sumado a una entrevista confidencial." },
    { title: "Extracción Segura", desc: "Registro de la donación real, donde se generan códigos únicos tanto para la bolsa como para tubos de prueba." },
    { title: "Liberación al Inventario", desc: "Validación estricta de pruebas serológicas. Solo tras resultados negativos se aprueba la unidad como Disponible." },
  ];

  return (
    <section id="proceso" className="relative min-h-screen bg-[#020202] flex items-center px-4 md:px-6 lg:px-12 py-16 md:py-24 overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Left: Text steps */}
        <div className="flex flex-col justify-center max-w-xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-10 self-start"
               style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
            <span className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">Flujo de Trabajo</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white mb-8 md:mb-16 leading-[1.1]">
            Simplicidad y <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-300">Seguridad</span> <br className="hidden lg:block"/>en cada etapa.
          </h2>
          
          <div className="space-y-4 md:space-y-6 lg:space-y-10 relative">
            {/* Animated progression line base */}
            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-white/5 md:block hidden" />

            {steps.map((s, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              
              return (
                <div 
                  key={i} 
                  className={`transition-all duration-700 cursor-pointer ${isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98]'}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className="flex items-start gap-6 relative">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 z-10 ${isActive ? 'bg-[#110A0A] border border-red-500/20 shadow-[0_4px_20px_rgba(220,38,38,0.2)]' : 'bg-white/5 border border-white/5'}`}>
                      <span className={`text-base md:text-lg font-black transition-colors duration-500 ${isActive ? 'text-red-500' : 'text-white/40'}`}>
                        0{i+1}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/70'}`}>{s.title}</h3>
                      <div className={`grid transition-all duration-500 ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                         <p className="text-white/40 leading-relaxed font-light overflow-hidden text-xs sm:text-sm lg:text-base">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Glassmorphic UI Mockups (Auto-Switching) */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[700px] perspective-1000 flex items-center justify-center transform scale-[0.85] md:scale-100 origin-center">
           
           {/* Step 1: Admission UI */}
           <div className={`absolute w-full max-w-sm md:max-w-md transform-style-3d transition-all duration-1000 ease-out flex items-center justify-center ${activeStep === 0 ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20' : activeStep > 0 ? 'opacity-0 -translate-y-20 scale-110 -rotate-x-12 z-0' : 'opacity-0 translate-y-20 scale-90 rotate-x-12 z-0'}`}>
             <div className="w-full bg-[#110B0B]/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-[0_20px_80px_rgba(220,38,38,0.05)] p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                   <div>
                     <div className="h-4 w-32 bg-white/20 rounded-md mb-2" />
                     <div className="h-3 w-24 bg-white/10 rounded-md" />
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="h-14 rounded-[1.2rem] bg-white/5 border border-white/5 flex items-center px-5 justify-between">
                    <span className="text-sm text-white/50">Identificación Física</span>
                    <span className="w-4 h-4 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-14 rounded-[1.2rem] bg-white/5 border border-white/5 flex items-center px-5 justify-between">
                    <span className="text-sm text-white/50">Historial Diferido</span>
                     <span className="w-4 h-4 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-14 rounded-[1.5rem] bg-gradient-to-r from-red-600 to-rose-500 flex items-center justify-center mt-10 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    <span className="text-sm text-white font-bold tracking-widest uppercase">Aprobar Accesos</span>
                  </div>
                </div>
             </div>
           </div>

           {/* Step 2: Vitals UI */}
           <div className={`absolute w-full max-w-sm md:max-w-md transform-style-3d transition-all duration-1000 ease-out flex items-center justify-center ${activeStep === 1 ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20' : activeStep > 1 ? 'opacity-0 -translate-y-20 scale-110 -rotate-x-12 z-0' : 'opacity-0 translate-y-20 scale-90 rotate-x-12 z-0'}`}>
             <div className="w-full bg-[#0B0F15]/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-blue-500/10 shadow-[0_20px_80px_rgba(59,130,246,0.1)] p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />
                
                <div className="flex justify-between items-center mb-8">
                  <span className="font-extrabold text-white text-lg">Signos Vitales</span>
                  <div className="flex gap-1">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"/>
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"/>
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                     <span className="text-xs text-white/40 block mb-2 tracking-widest uppercase">Presión Árt.</span>
                     <span className="text-3xl font-black text-white">120/80</span>
                   </div>
                   <div className="bg-blue-500/10 rounded-3xl p-6 border border-blue-500/20">
                     <span className="text-xs text-blue-400 block mb-2 tracking-widest uppercase">Hemoglobina</span>
                     <span className="text-3xl font-black text-blue-400">14.1</span>
                   </div>
                </div>
                <div className="h-24 bg-white/5 rounded-2xl border border-white/5 flex items-end justify-between px-4 pt-4 pb-2">
                  {[4, 6, 8, 4, 9, 6, 4, 7, 5, 8, 3, 6, 9].map((h, i) => (
                     <div key={i} className="w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full" style={{ height: `${h}0%` }} />
                  ))}
                </div>
             </div>
           </div>

           {/* Step 3: UID UI */}
           <div className={`absolute w-full max-w-sm md:max-w-md transform-style-3d transition-all duration-1000 ease-out flex items-center justify-center ${activeStep === 2 ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20' : activeStep > 2 ? 'opacity-0 -translate-y-20 scale-110 -rotate-x-12 z-0' : 'opacity-0 translate-y-20 scale-90 rotate-x-12 z-0'}`}>
             <div className="w-full bg-[#120D15]/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-purple-500/10 shadow-[0_20px_80px_rgba(168,85,247,0.1)] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="w-24 h-24 mx-auto bg-white/5 rounded-3xl border border-white/10 mb-8 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-3xl animate-ping opacity-20" />
                  <div className="flex flex-col gap-2">
                     <div className="w-10 h-1 bg-white/30 rounded-full"/>
                     <div className="w-14 h-1 bg-white/30 rounded-full"/>
                     <div className="w-8 h-1 bg-white/30 rounded-full"/>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">Generando Identificador</h4>
                <div className="inline-block px-6 py-4 bg-[#0A050A] rounded-2xl border border-purple-500/20 text-purple-300 tracking-[0.4em] font-mono text-sm shadow-inner">
                  8A9F-2B4C
                </div>
             </div>
           </div>

           {/* Step 4: Serology UI */}
           <div className={`absolute w-full max-w-sm md:max-w-md transform-style-3d transition-all duration-1000 ease-out flex items-center justify-center ${activeStep === 3 ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20' : activeStep > 3 ? 'opacity-0 -translate-y-20 scale-110 -rotate-x-12 z-0' : 'opacity-0 translate-y-20 scale-90 rotate-x-12 z-0'}`}>
             <div className="w-full bg-[#0A110D]/90 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-emerald-500/20 shadow-[0_20px_80px_rgba(16,185,129,0.1)] p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
                
                <h4 className="font-extrabold text-white mb-8 text-lg pl-2">Liberación Inmediata</h4>
                
                <div className="space-y-3 mb-10">
                  <div className="flex justify-between items-center text-sm font-medium text-white/50 border-b border-white/5 pb-2 px-2"><span>Marcador</span><span>Resultado</span></div>
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl"><span className="text-sm text-white/80">Hepatitis B</span><span className="text-sm text-emerald-500 font-bold">Negativo</span></div>
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl"><span className="text-sm text-white/80">Hepatitis C</span><span className="text-sm text-emerald-500 font-bold">Negativo</span></div>
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl"><span className="text-sm text-white/80">Sífilis</span><span className="text-sm text-emerald-500 font-bold">Negativo</span></div>
                  <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl"><span className="text-sm text-white/80">VIH</span><span className="text-sm text-emerald-500 font-bold">Negativo</span></div>
                </div>
                
                <div className="flex justify-between items-center p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <span className="font-bold text-white">Estado del Lote</span>
                  <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">Disponible</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

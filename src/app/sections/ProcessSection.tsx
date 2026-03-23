"use client";
import { ClipboardList, Stethoscope, FlaskConical, Thermometer, Truck } from "lucide-react";

export function ProcessSection() {
  const steps = [
    { num: "01", icon: ClipboardList, title: "REGISTRO", desc: "ADMISIÓN DEL DONANTE Y VALIDACIÓN DE IDENTIDAD LEGAL." },
    { num: "02", icon: Stethoscope, title: "EVALUACIÓN", desc: "PRUEBAS RÁPIDAS Y ENTREVISTA CLÍNICA PRE-EXTRACCIÓN." },
    { num: "03", icon: FlaskConical, title: "PROCESAMIENTO", desc: "FRACCIONAMIENTO EN PLASMA, PLAQUETAS Y GLÓBULOS." },
    { num: "04", icon: Thermometer, title: "ALMACENAMIENTO", desc: "CONTROL ESTRICTO DE TEMPERATURA Y ROTACIÓN." },
    { num: "05", icon: Truck, title: "DISTRIBUCIÓN", desc: "ENTREGA URGENTE BAJO PROTOCOLOS DE SEGURIDAD." },
  ];

  return (
    <section id="proceso" className="border-b-4 border-white bg-white/5">
      <div className="grid grid-cols-1 md:grid-cols-5 border-t border-white/20">
        {steps.map((s, i) => (
          <div
            key={i}
            className="p-12 text-center border-b md:border-b-0 border-r border-white/20 hover:bg-[#ef4444] hover:text-black transition-all group cursor-default last:border-r-0"
          >
            <div className="text-4xl font-landing-headline font-bold mb-4">{s.num}</div>
            <s.icon className="w-8 h-8 mx-auto mb-4 group-hover:text-black text-white transition-colors" />
            <h4 className="text-xl font-bold mb-2 font-landing-headline">{s.title}</h4>
            <p className="text-[10px] font-landing-body opacity-80">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

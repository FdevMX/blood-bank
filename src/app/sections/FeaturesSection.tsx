"use client";
import { Users, Database, Activity, Shield, BarChart3, Lock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "GESTIÓN DE DONANTES",
      desc: "PERFILES DETALLADOS CON HISTORIAL DIFERIDO Y EVALUACIONES PARAMÉTRICAS COMPLETAS.",
    },
    {
      icon: Database,
      title: "TRAZABILIDAD TOTAL",
      desc: "SEGUIMIENTO EXHAUSTIVO DE CADA UNIDAD EXTRAÍDA MEDIANTE CÓDIGOS CRIPTOGRÁFICOS.",
    },
    {
      icon: Activity,
      title: "EVALUACIÓN MÉDICA",
      desc: "CAPTURA ÁGIL DE SIGNOS VITALES COMO HEMOGLOBINA, PRESIÓN Y PESO EN TIEMPO REAL.",
    },
    {
      icon: Shield,
      title: "LIBERACIÓN SEGURA",
      desc: "VALIDACIÓN ESTRICTA DE PRUEBAS SEROLÓGICAS ANTES DE ASIGNAR EL ESTADO 'DISPONIBLE'.",
    },
    {
      icon: BarChart3,
      title: "MÉTRICAS Y ANÁLISIS",
      desc: "DASHBOARDS CON LA COMPOSICIÓN Y DÉFICITS DEL INVENTARIO SANGUÍNEO GENERAL.",
    },
    {
      icon: Lock,
      title: "AUDITORÍA EN TIEMPO REAL",
      desc: "LOGS INMUTABLES PARA CADA MOVIMIENTO O ACCESO AL SISTEMA, GARANTIZANDO SEGURIDAD.",
    },
  ];

  return (
    <section id="caracteristicas" className="p-8 lg:p-16 border-b-4 border-white">
      <div className="mb-16 border-l-8 border-[#ef4444] pl-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 font-landing-headline">
          MÓDULOS DE CONTROL <span className="text-[#ef4444]">ESPECIALIZADOS</span>
        </h2>
        <p className="font-landing-body text-white/50">
          SELECCIONE SUBSISTEMA PARA ACCEDER AL PANEL DE CONTROL
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#333]">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-10 border-r border-b border-[#333] hover:bg-[#ef4444] hover:text-black transition-colors group cursor-default"
          >
            <div className="mb-8">
              <f.icon className="w-10 h-10 group-hover:text-black text-white transition-colors" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-landing-headline">{f.title}</h3>
            <p className="font-landing-body text-sm leading-relaxed opacity-70 group-hover:opacity-100">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

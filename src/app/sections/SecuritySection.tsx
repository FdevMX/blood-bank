"use client";
import { Lock, ShieldCheck, FileText } from "lucide-react";

export function SecuritySection() {
  const items = [
    {
      title: "AUTENTICACIÓN SERVER-SIDE",
      desc: "USO DE SESIONES ESTABLES. CONTRASEÑAS PROTEGIDAS MEDIANTE ALGORITMOS DE HASHING BCRYPT.",
      icon: Lock,
    },
    {
      title: "CONTROL ESTRICTO (RBAC)",
      desc: "MIDDLEWARE EJECUTADO EN EDGE RUNTIME. LIMITACIÓN GEOMÉTRICA DE RUTAS POR ROLES DE USUARIO.",
      icon: ShieldCheck,
    },
    {
      title: "AUDITORÍA INMUTABLE",
      desc: "CADA MOVIMIENTO IMPACTA INMEDIATAMENTE UNA TABLA DE LOGS INMUTABLES CON SELLOS DE TIEMPO.",
      icon: FileText,
    },
  ];

  return (
    <section id="seguridad" className="p-12 lg:p-24 border-b-4 border-white bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-12 flex-wrap">
          <ShieldCheck className="w-14 h-14 lg:w-16 lg:h-16 text-[#ef4444]" />
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-landing-headline">
            SEGURIDAD DE <br />GRADO MILITAR
          </h2>
        </div>
        <p className="font-landing-body text-lg lg:text-xl text-white/60 mb-20 max-w-4xl border-l-4 border-white pl-8 leading-relaxed">
          PRIVACIDAD TOTAL DE LA INFORMACIÓN MÉDICA. EL SERVIDOR SE PROTEGE A SÍ MISMO A TRAVÉS DE ESTÁNDARES CRIPTOGRÁFICOS OWASP. CUMPLIMIENTO CON HIPAA Y REGULACIONES INTERNACIONALES DE SALUD.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-[#333]">
          {items.map((item, i) => (
            <div key={i} className={`p-10 hover:bg-white/5 transition-colors ${i < items.length - 1 ? 'border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#333]' : ''}`}>
              <item.icon className="w-10 h-10 text-[#ef4444] mb-6" />
              <h5 className="text-xl lg:text-2xl font-bold mb-4 font-landing-headline">{item.title}</h5>
              <p className="font-landing-body text-xs text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

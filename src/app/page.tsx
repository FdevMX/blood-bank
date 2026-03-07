import Link from "next/link";
import { ArrowRight, Shield, Droplets, Activity, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1210] text-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Droplets className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-[15px]">Banco de Sangre</span>
        </div>
        <Link
          href="/login"
          className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-2 text-sm font-medium transition-all backdrop-blur-sm"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* ── Hero ── */}
      <main className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-red-500/5 blur-[80px]" />

        <div className="relative text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-4 py-1.5 mb-8 anim-fade-up">
            <div className="h-2 w-2 rounded-full bg-red-500 anim-pulse-dot" />
            <span className="text-xs font-semibold text-red-300 tracking-wider uppercase">Sistema Activo</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] anim-fade-up d2">
            Gestión Integral<br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              de Banco de Sangre
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto anim-fade-up d3">
            Plataforma segura para la administración de donantes, donaciones, inventario y reportes médicos. Protegida bajo estándares OWASP.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10 anim-fade-up d4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-7 py-3.5 text-[15px] font-bold shadow-2xl shadow-red-900/40 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all"
            >
              Acceder al Sistema
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-24 max-w-4xl mx-auto">
          {[
            {
              icon: Shield,
              title: "Seguridad OWASP",
              desc: "Autenticación OAuth 2.0, control por roles y auditoría completa de cada acción.",
              gradient: "from-sky-500/20 to-sky-600/5",
              iconColor: "text-sky-400",
            },
            {
              icon: Heart,
              title: "Gestión de Donantes",
              desc: "Registro completo, elegibilidad médica, historial de donaciones y enfermedades.",
              gradient: "from-red-500/20 to-red-600/5",
              iconColor: "text-red-400",
            },
            {
              icon: Activity,
              title: "Control de Inventario",
              desc: "Seguimiento de cada unidad de sangre por grupo, estado y fecha de vencimiento.",
              gradient: "from-emerald-500/20 to-emerald-600/5",
              iconColor: "text-emerald-400",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`rounded-3xl bg-gradient-to-b ${feature.gradient} border border-white/[0.06] p-6 backdrop-blur-sm anim-fade-up`}
              style={{ animationDelay: `${500 + i * 100}ms` }}
            >
              <feature.icon className={`h-6 w-6 ${feature.iconColor} mb-4`} />
              <h3 className="font-bold text-[15px] mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-6 text-center">
        <p className="text-xs text-white/20">
          © 2026 Banco de Sangre — Sistema protegido bajo estándares OWASP
        </p>
      </footer>
    </div>
  );
}

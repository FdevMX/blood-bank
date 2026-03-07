import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Droplets,
  Users,
  Activity,
  FlaskConical,
  ArrowUpRight,
  Plus,
  Heart,
  Syringe,
  Search,
  FileBarChart,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const [
    totalDonantes,
    donantesActivos,
    donacionesHoy,
    donacionesMes,
    donacionesDisponibles,
    gruposSanguineos,
  ] = await Promise.all([
    prisma.donante.count(),
    prisma.donante.count({ where: { estado: "activo" } }),
    prisma.donacion.count({ where: { fecha: { gte: hoy } } }),
    prisma.donacion.count({ where: { fecha: { gte: inicioMes } } }),
    prisma.donacion.count({ where: { estado: "disponible" } }),
    prisma.grupoSanguineo.findMany({
      where: { activo: true },
      include: {
        donaciones: { where: { estado: "disponible" }, select: { id: true } },
      },
      orderBy: { grupo: "asc" },
    }),
  ]);

  return { totalDonantes, donantesActivos, donacionesHoy, donacionesMes, donacionesDisponibles, gruposSanguineos };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();
  const nombre = session?.user?.name?.split(" ")[0] ?? "Usuario";

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Gradient banner with greeting
         ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1210] via-[#2d1a14] to-[#4a1c1c] p-8 text-white anim-scale">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-500/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-red-600/8 blur-3xl" />
        <div className="absolute top-4 right-6 h-20 w-20 rounded-full border border-white/[0.05]" />
        <div className="absolute top-10 right-12 h-8 w-8 rounded-full border border-white/[0.04]" />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-red-300/70 text-sm font-medium mb-1">Panel de Control</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Bienvenido, {nombre}
            </h1>
            <p className="mt-2 text-white/50 text-sm max-w-md">
              Gestiona donantes, registra donaciones y supervisa el inventario de sangre desde un solo lugar.
            </p>
          </div>
          <Link
            href="/donaciones/nueva"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-500 px-5 py-3 text-sm font-bold shadow-xl shadow-red-900/40 transition-all hover:shadow-2xl hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nueva Donación
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          STAT CARDS — Each has its own distinct color & feel
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Donaciones Hoy — Red */}
        <Link href="/donaciones" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/20 anim-fade-up d1">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
            <Droplets className="h-5 w-5 mb-3 text-red-200" />
            <p className="text-3xl font-extrabold tabular-nums">{stats.donacionesHoy}</p>
            <p className="text-red-200/80 text-sm font-medium mt-1">Donaciones Hoy</p>
          </div>
        </Link>

        {/* Card 2: Donantes Activos — Teal */}
        <Link href="/donantes" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/20 anim-fade-up d2">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
            <Users className="h-5 w-5 mb-3 text-teal-200" />
            <p className="text-3xl font-extrabold tabular-nums">{stats.donantesActivos}</p>
            <p className="text-teal-200/80 text-sm font-medium mt-1">Donantes Activos</p>
            <p className="text-teal-300/50 text-xs mt-0.5">{stats.totalDonantes} registrados</p>
          </div>
        </Link>

        {/* Card 3: Del Mes — Amber */}
        <Link href="/donaciones" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20 anim-fade-up d3">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
            <Activity className="h-5 w-5 mb-3 text-amber-200" />
            <p className="text-3xl font-extrabold tabular-nums">{stats.donacionesMes}</p>
            <p className="text-amber-200/80 text-sm font-medium mt-1">Donaciones del Mes</p>
          </div>
        </Link>

        {/* Card 4: Stock — Violet */}
        <Link href="/donaciones" className="group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20 anim-fade-up d4">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
            <FlaskConical className="h-5 w-5 mb-3 text-violet-200" />
            <p className="text-3xl font-extrabold tabular-nums">{stats.donacionesDisponibles}</p>
            <p className="text-violet-200/80 text-sm font-medium mt-1">Unidades Disponibles</p>
          </div>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BLOOD GROUPS + QUICK ACTIONS
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Blood Group Inventory — 3 cols */}
        <div className="lg:col-span-3 rounded-3xl bg-white p-6 shadow-sm anim-fade-up d5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Inventario de Sangre</h2>
              <p className="text-sm text-muted-foreground">Unidades disponibles por grupo sanguíneo</p>
            </div>
            <Link href="/donaciones" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
              Ver todo <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.gruposSanguineos.map((g: any, i: number) => {
              const count = g.donaciones.length;
              const levelStyles = count === 0
                ? "bg-red-50 text-red-700"
                : count < 5
                ? "bg-amber-50 text-amber-700"
                : count < 15
                ? "bg-sky-50 text-sky-700"
                : "bg-emerald-50 text-emerald-700";
              return (
                <div
                  key={g.id}
                  className={`flex flex-col items-center justify-center rounded-2xl p-4 transition-all hover:scale-[1.06] cursor-default ${levelStyles} anim-scale`}
                  style={{ animationDelay: `${300 + i * 60}ms` }}
                >
                  <span className="text-lg font-extrabold leading-none">{g.grupo}</span>
                  <span className="text-2xl font-black mt-1 tabular-nums">{count}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] mt-1 opacity-60">unidades</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions — 2 cols */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm anim-fade-up d6">
          <h2 className="text-lg font-bold text-foreground mb-1">Acciones Rápidas</h2>
          <p className="text-sm text-muted-foreground mb-5">Lo que necesitas al instante</p>

          <div className="space-y-2">
            {[
              { label: "Registrar Donante", desc: "Nuevo donante al sistema", href: "/donantes/nuevo", icon: Heart, gradient: "from-rose-500 to-red-600" },
              { label: "Nueva Donación", desc: "Registrar donación de sangre", href: "/donaciones/nueva", icon: Syringe, gradient: "from-red-500 to-red-700" },
              { label: "Buscar Donante", desc: "Buscar por nombre o código", href: "/donantes", icon: Search, gradient: "from-teal-500 to-teal-700" },
              { label: "Generar Reporte", desc: "Exportar datos a PDF", href: "/reportes", icon: FileBarChart, gradient: "from-violet-500 to-indigo-700" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="group flex items-center gap-3 rounded-2xl p-3 hover:bg-muted/50 transition-all">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

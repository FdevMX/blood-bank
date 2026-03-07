"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Droplets,
  Users,
  LayoutDashboard,
  ShieldCheck,
  FileText,
  HeartHandshake,
  LogOut,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Donantes", href: "/donantes", icon: Users },
  { label: "Donaciones", href: "/donaciones", icon: Droplets },
  { label: "Reportes", href: "/reportes", icon: BarChart3 },
];

const configItems = [
  { label: "Catálogos", href: "/catalogos/enfermedades", icon: HeartHandshake },
];

const adminItems = [
  { label: "Usuarios", href: "/usuarios", icon: ShieldCheck },
  { label: "Auditoría", href: "/auditoria", icon: FileText },
];

const rolBadge: Record<string, { label: string; bg: string; text: string }> = {
  administrador: { label: "Admin", bg: "bg-red-600", text: "text-white" },
  operador: { label: "Operador", bg: "bg-amber-500", text: "text-white" },
  consulta: { label: "Consulta", bg: "bg-sky-500", text: "text-white" },
};

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const rol = session?.user?.rol ?? "consulta";
  const isAdmin = rol === "administrador";
  const badge = rolBadge[rol] ?? rolBadge.consulta;

  return (
    <aside className="flex flex-col h-full w-[260px] bg-[#1a1210] text-white/90 shrink-0 select-none">
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#1a1210] anim-pulse-dot" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight leading-tight">Banco de Sangre</h1>
            <p className="text-[10px] text-white/40 font-medium tracking-[0.15em] uppercase">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-5 pb-4">
        <NavSection label="Menú">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClose={onClose} />
          ))}
        </NavSection>

        {isAdmin && (
          <NavSection label="Configuración">
            {configItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClose={onClose} />
            ))}
          </NavSection>
        )}

        {isAdmin && (
          <NavSection label="Seguridad">
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClose={onClose} />
            ))}
          </NavSection>
        )}
      </nav>

      {/* ── User ── */}
      <div className="px-3 pb-4 space-y-2">
        <div className="rounded-2xl bg-white/[0.06] p-3.5">
          {status === "loading" ? (
            <div className="h-10 rounded-lg bg-white/10 animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  session?.user?.name?.[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-tight">
                  {session?.user?.name ?? "Usuario"}
                </p>
                <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 mb-2 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavLink({ item, pathname, onClose }: { item: (typeof menuItems)[0]; pathname: string; onClose?: () => void }) {
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link href={item.href} onClick={onClose}>
      <div
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/30"
            : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
        }`}
      >
        <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-white/40 group-hover:text-red-400"} transition-colors`} />
        <span className="flex-1">{item.label}</span>
        {active && <ChevronRight className="h-3.5 w-3.5 text-white/60" />}
      </div>
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  obtenerNotificaciones,
  type Notificacion,
  type NotificacionTipo,
} from "@/app/actions/notificaciones";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const config: Record<
  NotificacionTipo,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  critico: {
    icon: AlertCircle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
  },
  advertencia: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
  },
};

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notificacion[] | null>(null);

  // Refetch cada vez que el panel se abre. Sin setState sincrónico en el body.
  useEffect(() => {
    if (!open) return;
    obtenerNotificaciones()
      .then((data) => setNotifs(data))
      .catch(() => setNotifs([]));
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const loading = notifs === null;
  const list = notifs ?? [];
  const criticos = list.filter((n) => n.tipo === "critico").length;
  const advertencias = list.filter((n) => n.tipo === "advertencia").length;

  const handleNavigate = (href?: string) => {
    if (!href) return;
    onClose();
    router.push(href);
  };

  const footerLabel = () => {
    if (loading) return "";
    if (list.length === 0) return "Sin alertas activas";
    const parts: string[] = [];
    if (criticos > 0) parts.push(`${criticos} crítico${criticos !== 1 ? "s" : ""}`);
    if (advertencias > 0) parts.push(`${advertencias} advertencia${advertencias !== 1 ? "s" : ""}`);
    const infos = list.length - criticos - advertencias;
    if (infos > 0) parts.push(`${infos} aviso${infos !== 1 ? "s" : ""}`);
    return parts.join(" · ");
  };

  return (
    <>
      {/* Backdrop invisible para cerrar al hacer clic fuera */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="fixed top-16 right-2 sm:right-4 z-50 w-90 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#120b0a] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Panel de notificaciones"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Notificaciones</span>
            {list.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/20 px-1.5 font-mono text-[10px] font-bold text-red-400">
                {list.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Cerrar notificaciones"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="max-h-[min(480px,calc(100vh-120px))] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-300">Todo en orden</p>
                <p className="mt-0.5 text-xs text-zinc-600">
                  No hay alertas activas en el sistema
                </p>
              </div>
            </div>
          )}

          {!loading && list.length > 0 && (
            <ul className="py-2">
              {list.map((notif) => {
                const { icon: Icon, iconBg, iconColor, titleColor } = config[notif.tipo];
                return (
                  <li key={notif.id}>
                    <button
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/3 ${
                        notif.href ? "cursor-pointer" : "cursor-default"
                      }`}
                      onClick={() => handleNavigate(notif.href)}
                      disabled={!notif.href}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm font-medium leading-tight ${titleColor}`}
                        >
                          {notif.titulo}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500">
                          {notif.descripcion}
                        </span>
                      </span>
                      {notif.href && (
                        <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-zinc-700" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pie */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2">
          <span className="text-[11px] text-zinc-600">{footerLabel()}</span>
          <button
            onClick={() => {
              onClose();
              router.push("/auditoria");
            }}
            className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Ver auditoría →
          </button>
        </div>
      </div>
    </>
  );
}

import { getUsuarioDetalle } from "@/app/actions/usuarios";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  History,
  Activity,
  Calendar,
  ChevronLeft,
  Database,
  Settings2,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function UsuarioDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const usuarioId = parseInt(id);
  if (isNaN(usuarioId)) notFound();

  const usuario = await getUsuarioDetalle(usuarioId);
  if (!usuario) notFound();

  const getActionStyles = (action: string) => {
    switch (action) {
      case "CREATE":
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: Database };
      case "UPDATE":
        return { color: "text-amber-600 bg-amber-50 border-amber-200", icon: Settings2 };
      case "DELETE":
        return { color: "text-red-600 bg-red-50 border-red-200", icon: ShieldAlert };
      case "LOGIN":
        return { color: "text-blue-600 bg-blue-50 border-blue-200", icon: Key };
      case "LOGOUT":
        return { color: "text-slate-600 bg-slate-50 border-slate-200", icon: Key };
      default:
        return { color: "text-muted-foreground bg-muted border-transparent", icon: Activity };
    }
  };

  const audits = usuario.auditorias ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 anim-fade-up d1">
      {/* Back nav */}
      <div className="flex items-center gap-4">
        <Link
          href="/usuarios"
          className="h-12 w-12 rounded-2xl bg-white border border-border/50 flex items-center justify-center hover:bg-muted transition-all shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Expediente de Usuario
          </h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            ID de Sistema:{" "}
            <span className="text-teal-600">#{usuario.id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-red-600/5 to-transparent blur-3xl rounded-full translate-x-10 -translate-y-10" />

            <div className="relative flex flex-col items-center text-center space-y-5">
              <div
                className={`h-24 w-24 rounded-[32px] flex items-center justify-center text-3xl font-black text-white shadow-2xl relative
                  ${
                    usuario.estado === "inactivo"
                      ? "bg-muted"
                      : usuario.rol === "administrador"
                      ? "bg-gradient-to-br from-[#1a1210] to-red-700"
                      : usuario.rol === "operador"
                      ? "bg-gradient-to-br from-teal-500 to-teal-700"
                      : "bg-gradient-to-br from-indigo-500 to-indigo-700"
                  }
                `}
              >
                {usuario.nombreUsuario.charAt(0).toUpperCase()}
                {usuario.estado === "activo" && (
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-white" />
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-foreground">
                  {usuario.nombreUsuario}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {usuario.rol === "administrador" ? (
                    <ShieldCheck className="h-3 w-3 text-red-500" />
                  ) : (
                    <UserCircle className="h-3 w-3" />
                  )}
                  {usuario.rol}
                </div>
              </div>

              <div className="w-full space-y-3 pt-2">
                <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <div className="h-10 w-10 flex border items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {usuario.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <div className="h-10 w-10 flex border items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Alta en Sistema
                    </p>
                    <p className="text-sm font-bold text-foreground uppercase">
                      {format(new Date(usuario.fechaCreacion), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <div className="h-10 w-10 flex border items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
                    <Activity className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Ultimo Acceso
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {usuario.ultimoAcceso
                        ? formatDistanceToNow(new Date(usuario.ultimoAcceso), {
                            addSuffix: true,
                            locale: es,
                          })
                        : "Sin actividad"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`w-full p-4 rounded-3xl border text-center font-bold text-sm flex items-center justify-center gap-2
                  ${
                    usuario.estado === "activo"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }
                `}
              >
                {usuario.estado === "activo" ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Cuenta{" "}
                {usuario.estado === "activo" ? "Operativa" : "Suspendida"}
              </div>
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-border/50 min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                <History className="h-6 w-6 text-teal-600" />
                Bitacora de Cambios
              </h3>
              <span className="px-4 py-1.5 rounded-2xl bg-muted font-bold text-xs text-muted-foreground border border-border/10">
                {audits.length} registros
              </span>
            </div>

            {audits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                  <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Sin registros aun</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Este usuario no ha realizado acciones registradas en el sistema.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left align-middle border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="font-semibold py-3 px-4">Fecha / Hora</th>
                      <th className="font-semibold py-3 px-4">Acción</th>
                      <th className="font-semibold py-3 px-4">Registro Afectado</th>
                      <th className="font-semibold py-3 px-4 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {audits.map((log: any) => {
                      const st = getActionStyles(log.accion);
                      const fechaFormatted = format(new Date(log.fecha), "dd MMM yyyy", { locale: es });
                      const horaFormatted = format(new Date(log.fecha), "HH:mm");

                      return (
                        <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <p className="font-bold text-foreground text-xs">{fechaFormatted}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{horaFormatted} hrs</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                               <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${st.color}`}>
                                 <st.icon className="h-4 w-4" />
                               </div>
                               <span className={`px-2 py-0.5 text-[9px] rounded-md font-black uppercase tracking-widest ${st.color}`}>
                                 {log.accion}
                               </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {log.tablaAfectada ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{log.tablaAfectada}</span>
                                <span className="font-mono text-xs text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded w-fit">ID: {log.registroId ?? "-"}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-xs font-medium text-foreground">{log.detalles}</span>
                            {log.ipAddress && (
                              <div className="text-[10px] font-mono text-muted-foreground mt-1 text-right">
                                IP: {log.ipAddress}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

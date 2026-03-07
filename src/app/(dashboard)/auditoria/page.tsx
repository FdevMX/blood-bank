import { getAuditoria } from "@/app/actions/auditoria";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  History,
  Search,
  Activity,
  ShieldAlert,
  Settings2,
  FileBox,
  Key,
  Database,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LiveSearch } from "@/components/ui/LiveSearch";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") {
    redirect("/dashboard");
  }

  const { q: rawQ } = await searchParams;
  const q = rawQ || "";
  const logs = await getAuditoria(q, 100);

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
        return { color: "text-muted-foreground bg-muted", icon: Activity };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 anim-fade-up d1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <History className="h-8 w-8 text-teal-600" />
            Control de Auditoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {q ? (
              <>
                Mostrando{" "}
                <span className="font-bold text-foreground">{logs.length}</span>{" "}
                resultado(s) para:{" "}
                <span className="font-bold text-teal-600">"{q}"</span>
              </>
            ) : (
              <>
                Registro inmutable de seguridad. Ultimos{" "}
                <span className="font-bold text-foreground">{logs.length}</span>{" "}
                eventos del sistema.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-border/50 flex">
        <LiveSearch placeholder="Buscar por tabla, IP, usuario o tipo de accion (CREATE, UPDATE, DELETE, LOGIN)..." />
      </div>

      {/* Event Timeline */}
      <div className="bg-white rounded-3xl shadow-sm border border-border/50 p-6 md:p-10 relative overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <ShieldAlert className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold text-foreground">
              {q ? "No se encontraron resultados para tu busqueda." : "Registro vacio."}
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left align-middle border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="font-semibold py-3 px-4">Fecha / Hora</th>
                  <th className="font-semibold py-3 px-4">Acción</th>
                  <th className="font-semibold py-3 px-4">Usuario</th>
                  <th className="font-semibold py-3 px-4">IP / UID</th>
                  <th className="font-semibold py-3 px-4">Registro Afectado</th>
                  <th className="font-semibold py-3 px-4 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log: any) => {
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
                      <td className="py-3 px-4 font-bold text-sm max-w-[150px] truncate" title={log.usuario ? log.usuario.nombreUsuario : "Sistema"}>
                        {log.usuario ? log.usuario.nombreUsuario : "Sistema"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded mr-1">
                          {log.ipAddress || "Interna"}
                        </span>
                        <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">UID: {log.idUsuario ?? "SYS"}</div>
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
                        {(log.datosAnteriores || log.datosNuevos) ? (
                          <details className="group inline-block text-left cursor-pointer z-10">
                            <summary className="text-[11px] font-bold bg-muted hover:bg-muted/80 px-2 py-1 rounded text-foreground transition-all select-none">
                              Ver Payloads
                            </summary>
                            <div className="absolute right-8 mt-2 w-80 bg-white border border-border/50 shadow-2xl rounded-2xl p-4 cursor-auto z-50 pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                              {log.datosAnteriores && (
                                <div className="bg-red-50/50 border border-red-100 rounded-xl p-2 max-h-40 overflow-y-auto mb-2 text-left">
                                  <p className="text-[9px] uppercase font-bold text-red-500 mb-1">Pre-Cambio</p>
                                  <pre className="text-[10px] font-mono text-red-800/80 w-full overflow-x-auto">
                                    {JSON.stringify(log.datosAnteriores, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.datosNuevos && (
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2 max-h-40 overflow-y-auto text-left">
                                  <p className="text-[9px] uppercase font-bold text-emerald-600 mb-1">Nuevo Payload</p>
                                  <pre className="text-[10px] font-mono text-emerald-800/80 w-full overflow-x-auto">
                                    {JSON.stringify(log.datosNuevos, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </details>
                        ) : (
                          <span className="text-muted-foreground">-</span>
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
  );
}

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
        {q && (
          <a
            href="/auditoria"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-muted text-sm font-bold text-muted-foreground hover:bg-muted/80 transition-all border border-border/30 shrink-0"
          >
            Limpiar filtro
          </a>
        )}
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-border/50 flex">
        <form
          action="/auditoria"
          method="GET"
          className="flex-1 relative flex items-center h-12 gap-2"
        >
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por tabla, IP, usuario o tipo de accion (CREATE, UPDATE, DELETE, LOGIN)..."
            className="w-full h-full bg-transparent pl-12 pr-4 outline-none text-[15px] font-medium placeholder:text-muted-foreground/60 transition-all"
          />
          <button
            type="submit"
            className="shrink-0 h-9 px-5 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white text-xs font-bold hover:from-teal-500 hover:to-teal-600 transition-all shadow-sm mr-1"
          >
            Buscar
          </button>
          {q && (
            <a
              href="/auditoria"
              className="shrink-0 h-9 px-4 rounded-2xl bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-all flex items-center mr-1"
            >
              Limpiar
            </a>
          )}
        </form>
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
          <div className="relative border-l border-dashed border-border/60 ml-3 space-y-8 pb-4">
            {logs.map((log: any) => {
              const st = getActionStyles(log.accion);
              const fechaFormatted = format(new Date(log.fecha), "dd MMM yyyy", { locale: es });
              const horaFormatted = format(new Date(log.fecha), "HH:mm");

              return (
                <div key={log.id} className="relative pl-8 pt-1">
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-white border-[3px] border-slate-800" />

                  <div className="bg-muted/10 rounded-2xl border border-border/50 p-5 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      {/* Left: icon + user + action */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-10 w-10 flex border items-center justify-center rounded-xl shadow-sm shrink-0 ${st.color}`}
                        >
                          <st.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold flex items-center gap-2 flex-wrap">
                            <span className="truncate">
                              {log.usuario ? log.usuario.nombreUsuario : "Sistema"}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[9px] rounded-md font-black uppercase tracking-widest shrink-0 ${st.color}`}
                            >
                              {log.accion}
                            </span>
                          </p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                            IP:{" "}
                            <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                              {log.ipAddress || "Interna"}
                            </span>{" "}
                            &bull; UID: {log.idUsuario ?? "SYS"}
                          </p>
                        </div>
                      </div>

                      {/* Right: date/time — STATIC, no locale-dependent calls */}
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-black uppercase text-foreground/50 tracking-wider">
                          {fechaFormatted}
                        </p>
                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                          {horaFormatted} hrs
                        </p>
                      </div>
                    </div>

                    {/* Tabla afectada */}
                    {log.tablaAfectada && (
                      <div className="flex items-center gap-2 bg-white rounded-xl py-3 px-4 border border-border/50 shadow-sm text-sm">
                        <FileBox className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground font-semibold">Registro:</span>
                        <span className="font-bold font-mono text-[13px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          /{log.tablaAfectada}/{log.registroId ?? "-"}
                        </span>
                      </div>
                    )}

                    {/* JSON diff */}
                    {(log.datosAnteriores || log.datosNuevos) && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {log.datosAnteriores && (
                          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 max-h-32 overflow-y-auto">
                            <p className="text-[10px] uppercase font-bold text-red-500 mb-1">
                              Datos Anteriores
                            </p>
                            <pre className="text-[10px] font-mono text-red-800/80">
                              {JSON.stringify(log.datosAnteriores, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.datosNuevos && (
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 max-h-32 overflow-y-auto">
                            <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">
                              Datos Nuevos
                            </p>
                            <pre className="text-[10px] font-mono text-emerald-800/80">
                              {JSON.stringify(log.datosNuevos, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getDonacionDetalle, actualizarEstadoDonacion } from "@/app/actions/donaciones";
import { ArrowLeft, FlaskConical, Droplets, UserCircle2, Activity, Settings2, ShieldCheck, Thermometer, Weight, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { formatDateSafe } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DonacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donacion = await getDonacionDetalle(Number(id));
  const session = await auth();

  if (!donacion) notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 anim-fade-up d1">
      {/* ── Navbar Contextual ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link href="/donaciones" className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-0.5">Control y Registro Trazable</p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-extrabold text-foreground tracking-tight">
                Unidad {donacion.codigo}
              </h1>
              <span className={`whitespace-nowrap px-3 py-1 text-[10px] font-black uppercase rounded-md shadow-sm border ${
                  donacion.estado === "disponible" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  donacion.estado === "utilizada" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  "bg-red-50 text-red-700 border-red-200"
              }`}>
                {donacion.estado}
              </span>
            </div>
          </div>
        </div>
        
        {session?.user?.rol !== "consulta" && donacion.estado === "disponible" && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <form action={async () => { "use server"; await actualizarEstadoDonacion(donacion.id, "utilizada", "Unidad despachada e infundida en paciente con éxito."); }} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto justify-center px-4 py-2 text-[13px] font-bold rounded-xl border transition-all bg-blue-50/50 text-blue-700 border-blue-200 hover:bg-blue-100 flex items-center gap-2 shadow-sm">
                Marcar Utilizada
              </button>
            </form>
            <form action={async () => { "use server"; await actualizarEstadoDonacion(donacion.id, "descartada", "Descartada por anomalías post-extracción reportadas por el sistema."); }} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto justify-center px-4 py-2 text-[13px] font-bold rounded-xl border transition-all bg-red-50/50 text-red-700 border-red-200 hover:bg-red-100 flex items-center gap-2 shadow-sm">
                Descartar Unidad
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Tarjas Principales */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#1a1210] to-[#3a2018] p-6 text-white overflow-hidden relative shadow-lg">
            <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/20 blur-3xl rounded-full" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-300 mb-1 flex items-center gap-1.5"><Droplets className="h-4 w-4" /> Tipo Sanguíneo</p>
            <p className="text-5xl font-black mt-1 mb-2">
              {donacion.grupoSanguineo?.grupo || <span className="text-2xl text-white/40">S/R</span>}
            </p>
            <p className="text-sm font-medium text-white/50">{donacion.clasificacion?.nombre || "Sin clasificar"} • {Number(donacion.cantidadMl)} mL</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 border-b pb-3">
              <UserCircle2 className="h-5 w-5 text-teal-600" /> Donante Origen
            </h3>
            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground hover:text-teal-600 cursor-pointer transition-colors flex items-center gap-2 group">
                 <Link href={`/donantes/${donacion.idDonante}`}>{donacion.donante.nombres} {donacion.donante.apellidos}</Link> 
              </p>
              <DataRow label="ID de Referencia" value={donacion.donante.codigo} />
              <DataRow label="DNI/Pasaporte" value={donacion.donante.documentoIdentidad} />
              <DataRow label="Recolección" value={formatDateSafe(donacion.fecha)} block />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Datos Clínicos */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 border-b pb-3">
              <Activity className="h-5 w-5 text-rose-600" /> Pruebas y Signos en Extracción
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               
               <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 text-center">
                 <Weight className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Peso</p>
                 <p className="text-lg font-black">{donacion.peso ? `${donacion.peso} kg` : "--"}</p>
               </div>
               
               <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 text-center">
                 <Thermometer className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Temperatura</p>
                 <p className="text-lg font-black">{donacion.temperatura ? `${donacion.temperatura} °C` : "--"}</p>
               </div>
               
               <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 text-center">
                 <Activity className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tensión Art.</p>
                 <p className="text-lg font-black">{donacion.tensionArterial || "--"}</p>
               </div>
               
               <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 text-center">
                 <Droplets className="h-6 w-6 text-rose-500 mx-auto mb-2 opacity-50" />
                 <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Hemoglobina</p>
                 <p className="text-lg font-black">{donacion.hemoglobina ? `${donacion.hemoglobina} g/dL` : "--"}</p>
               </div>
               
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 border-b pb-3">
              <Settings2 className="h-5 w-5 text-indigo-600" /> Cadena de Suministro y Validaciones
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 items-center justify-between flex">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest mb-1">LSO (Lote de Sistema)</p>
                    <p className="text-base font-black text-indigo-900 font-mono">{donacion.lso || "NO APLICADO AÚN"}</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-indigo-300" />
                </div>
                
                <div className="flex-1 bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Fecha Límite (Vencimiento)</p>
                    <p className="text-base font-black text-amber-900">{donacion.fechaVencimiento ? formatDateSafe(donacion.fechaVencimiento) : "N/D"}</p>
                  </div>
                  <FileText className="h-8 w-8 text-amber-300" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-dashed border-border/60">
                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Observaciones, Trazas y Eventos Anómalos</p>
                <div className="bg-muted/20 p-4 rounded-xl text-sm leading-relaxed border border-border/30 whitespace-pre-wrap">
                  {donacion.observaciones || <span className="text-muted-foreground italic">Sin observaciones o anotaciones marcadas durante el proceso de flebotomía ni almacenaje de la unidad.</span>}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

function DataRow({ label, value, block }: { label: string; value?: string | null; block?: boolean }) {
  if (block) {
    return (
      <div className="border-t border-dashed border-border/60 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-baseline border-t border-dashed border-border/60 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-foreground text-right">{value || "—"}</p>
    </div>
  );
}

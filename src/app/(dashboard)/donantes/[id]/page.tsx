import Link from "next/link";
import { notFound } from "next/navigation";
import { getDonanteDetalle, evaluarElegibilidad, toggleEstadoDonante } from "@/app/actions/donantes";
import { UserCircle2, ArrowLeft, HeartPulse, History, AlertTriangle, ShieldAlert, CheckCircle2, XCircle, FileText, Settings2, ShieldCheck } from "lucide-react";
import { formatDateSafe } from "@/lib/utils";
import { DeleteDonanteButton } from "@/components/donantes/DeleteDonanteButton";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DonanteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donante = await getDonanteDetalle(Number(id));
  if (!donante) notFound();

  // Evaluamos elegibilidad con las reglas médicas del backend
  const { elegible, motivo } = await evaluarElegibilidad(donante);
  
  const session = await auth();
  const isAdmin = session?.user?.rol === "administrador";
  
  const inactivo = donante.estado === "inactivo";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 anim-fade-up d1">
      {/* ── Navbar Contextual ── */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-5">
        <Link href="/donantes" className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-0.5">Expediente Médico Completo</p>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">{donante.nombres} {donante.apellidos}</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md text-muted-foreground ml-2">
              {donante.codigo}
            </span>
            {inactivo && (
               <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                 <span className="h-1.5 w-1.5 rounded-full bg-red-500 anim-pulse-dot" /> INACTIVO
               </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <form action={async () => { "use server"; await toggleEstadoDonante(donante.id); }}>
            <button className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${
              inactivo 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            }`}>
              {inactivo ? "Reactivar Perfil" : "Desactivar Perfil"}
            </button>
          </form>
          <Link href={`/donantes/${donante.id}/editar`} className="px-5 py-2 text-sm font-bold bg-[#1a1210] text-white hover:bg-[#2d1a14] rounded-xl transition-all shadow-lg flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> Editar
          </Link>
          {isAdmin && (
            <DeleteDonanteButton id={donante.id} nombre={`${donante.nombres} ${donante.apellidos}`} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── COL IZQUIERDA: Tarjeta Principal y Elegibilidad ── */}
        <div className="space-y-6">
          
          {/* Tarjeta de Elegibilidad Médica (MUY IMPORTANTE) */}
          <div className={`rounded-3xl p-6 shadow-sm border-2 overflow-hidden relative ${
            elegible 
              ? "bg-emerald-50 border-emerald-500/30" 
              : "bg-rose-50 border-rose-500/30"
          }`}>
            <div className={`absolute top-0 right-0 p-8 rounded-bl-full ${elegible ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
               {elegible ? <ShieldCheck className="h-10 w-10 text-emerald-500 opacity-50" /> : <ShieldAlert className="h-10 w-10 text-rose-500 opacity-50" />}
            </div>

            <div className="relative">
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${elegible ? "text-emerald-700" : "text-rose-700"}`}>
                Veredicto del Sistema
              </p>
              <h2 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${elegible ? "text-emerald-900" : "text-rose-900"}`}>
                {elegible ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <XCircle className="h-6 w-6 text-rose-600" />}
                {elegible ? "Apto para Donar" : "No Elegible"}
              </h2>
              <p className={`text-sm mt-3 leading-relaxed font-medium ${elegible ? "text-emerald-800" : "text-rose-800"}`}>
                {motivo}
              </p>

              {elegible && !inactivo && (
                <Link href={`/donaciones/nueva?donanteId=${donante.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-5 py-3 text-sm font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all">
                  Registrar Donación Ahora
                </Link>
              )}
            </div>
          </div>

          {/* Tarjeta de Datos de Identidad */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 border-b pb-3">
              <UserCircle2 className="h-5 w-5 text-teal-600" /> Información General
            </h3>
            <div className="space-y-4">
              <DataRow label="DNI/Pasaporte" value={donante.documentoIdentidad} />
              <DataRow label="Sexo Registrado" value={donante.sexo} />
              <DataRow label="Nacimiento" value={donante.fechaNacimiento ? formatDateSafe(donante.fechaNacimiento) : null} />
              <DataRow label="Ocupación" value={donante.ocupacion} />
              <DataRow label="Lugar Trabajo" value={donante.centroTrabajo} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-border/50">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4 border-b pb-3">
              <FileText className="h-5 w-5 text-teal-600" /> Contacto
            </h3>
            <div className="space-y-4">
              <DataRow label="Teléfono" value={donante.telefono} />
              <DataRow label="Email" value={donante.email} />
              <DataRow label="Dirección" value={donante.direccion} block />
              <DataRow label="Zona" value={donante.municipio ? `${donante.municipio}, ${donante.departamento}` : null} />
            </div>
          </div>

        </div>

        {/* ── COL DERECHA: Perfil Clínico e Historial ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tarjas Superiores: Grupo, Donaciones Previas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-[#1a1210] to-[#3a2018] p-6 text-white overflow-hidden relative shadow-lg">
               <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/20 blur-3xl rounded-full" />
               <p className="text-[11px] font-bold uppercase tracking-widest text-red-300 mb-1">Grupo Sanguíneo</p>
               <p className="text-5xl font-black mt-1 mb-2">
                 {donante.grupoSanguineo?.grupo || <span className="text-2xl text-white/40">S/R</span>}
               </p>
               <p className="text-sm font-medium text-white/50">{donante.tipoDonante?.nombre || "Sin clasificar"}</p>
            </div>
            
            <div className="rounded-3xl bg-white border border-border/50 p-6 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500/10 blur-3xl rounded-full" />
               <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Última Donación</p>
               <p className="text-2xl font-black text-foreground mt-1 mb-2">
                 {donante.fechaUltimaDonacion ? formatDateSafe(donante.fechaUltimaDonacion) : "Nunca"}
               </p>
               <p className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                 <HeartPulse className="h-4 w-4 text-rose-500" />
                 {donante.donacionesPrevias ? "Ya era donante recurrente" : "Donante de Primera Vez"}
               </p>
            </div>
          </div>

          {/* Historial de Enfermedades */}
          <div className="rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden">
             <div className="p-6 border-b border-border/50 bg-muted/10">
               <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                 <AlertTriangle className="h-5 w-5 text-amber-500" /> Antecedentes y Enfermedades Recientes
               </h3>
               <p className="text-sm text-muted-foreground mt-1">
                 {donante.transfusionesPrevias && <span className="font-bold text-rose-600">⚠ Reporta transfusiones de sangre previas. </span>}
                 Registro clínico capturado al momento de la afiliación.
               </p>
             </div>
             
             <div className="p-6">
                {donante.enfermedades.length === 0 ? (
                  <div className="text-center py-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-emerald-800 font-bold">Sin enfermedades excluyentes registradas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {donante.enfermedades.map((te: any) => (
                      <div key={te.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                         <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                         <div>
                           <p className="text-sm font-bold text-rose-900">{te.enfermedad.nombre}</p>
                           <p className="text-xs text-rose-700 opacity-80 mt-0.5">Capturado: {formatDateSafe(te.fechaDiagnostico)}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          {/* Historial de Donaciones In-System */}
          <div className="rounded-3xl bg-white shadow-sm border border-border/50 overflow-hidden">
             <div className="p-6 border-b border-border/50 flex items-center justify-between">
               <h3 className="font-bold text-foreground flex items-center gap-2">
                 <History className="h-5 w-5 text-teal-600" /> Donaciones en el Sistema (Últimas 5)
               </h3>
             </div>
             
             {donante.donaciones.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No hay donaciones registradas para este donante en nuestro sistema aún.
                </div>
             ) : (
                <div className="divide-y divide-border/50">
                  {donante.donaciones.map((d: any) => (
                    <div key={d.id} className="p-5 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div>
                        <p className="font-bold text-sm">{formatDateSafe(d.fecha)}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{d.codigo} • {Number(d.cantidadMl)} ml</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        d.estado === "disponible" ? "bg-emerald-50 text-emerald-700" :
                        d.estado === "utilizada" ? "bg-blue-50 text-blue-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {d.estado.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
             )}
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

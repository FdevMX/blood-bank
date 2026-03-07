import { FileBarChart, PieChart, TrendingUp, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { getReporteDonantesPorSexo, getReporteInventarioSanguineo, getReporteDonacionesPeriodo } from "@/app/actions/reportes";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  const [reporteSexo, reporteInventario, reporteDonaciones] = await Promise.all([
    getReporteDonantesPorSexo(),
    getReporteInventarioSanguineo(),
    getReporteDonacionesPeriodo()
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 anim-fade-up d1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileBarChart className="h-8 w-8 text-violet-500" />
            Reportes Estadísticos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas de Banco de Sangre, perfiles demográficos e inventario físico de unidades en tiempo real.
          </p>
        </div>
        <Link 
          href="/reportes/donaciones"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-violet-900/20 hover:bg-violet-500 hover:-translate-y-0.5 transition-all w-fit"
        >
          Ir a Donaciones por Período <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* REPORTE 1: DONANTES POR SEXO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 anim-fade-up d2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <PieChart className="h-5 w-5 text-teal-600" /> Donantes Demografía
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Distribución histórica de {reporteSexo.total} donantes por sexo biológico asignado.</p>
            </div>
            {/* Visual Download Button Simulation */}
            <button className="h-10 w-10 shrink-0 rounded-xl bg-muted/40 text-muted-foreground flex items-center justify-center hover:bg-muted transition-colors cursor-pointer" title="Exportar a PDF">
               <Download className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <div className="flex-1 rounded-2xl bg-teal-50 p-5 flex flex-col justify-center border border-teal-100">
                <p className="text-sm font-bold text-teal-800 uppercase tracking-widest mb-1">Femenino</p>
                <div className="flex items-end gap-2">
                   <span className="text-4xl font-black text-teal-600 tabular-nums leading-none">{reporteSexo.femenino}</span>
                   <span className="text-lg font-bold text-teal-600/50 mb-0.5">{reporteSexo.porcentajeFemenino}%</span>
                </div>
             </div>
             <div className="flex-1 rounded-2xl bg-indigo-50 p-5 flex flex-col justify-center border border-indigo-100">
                <p className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-1">Masculino</p>
                <div className="flex items-end gap-2">
                   <span className="text-4xl font-black text-indigo-600 tabular-nums leading-none">{reporteSexo.masculino}</span>
                   <span className="text-lg font-bold text-indigo-600/50 mb-0.5">{reporteSexo.porcentajeMasculino}%</span>
                </div>
             </div>
          </div>
          
          {/* Progress Bar Visual Representation */}
          <div className="h-6 w-full rounded-full flex overflow-hidden">
             <div style={{ width: `${reporteSexo.porcentajeFemenino}%` }} className="h-full bg-teal-500 rounded-l-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000" />
             <div style={{ width: `${reporteSexo.porcentajeMasculino}%` }} className="h-full bg-indigo-500 rounded-r-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000" />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3 font-medium">*{reporteSexo.inactivos} del total de afiliados están inactivos.</p>
        </div>


        {/* REPORTE 2: INVENTARIO FÍSICO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 anim-fade-up d3">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-rose-600" /> Stock Sanguíneo Activo
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Disponibilidad garantizada: {reporteInventario.totalUnidades} uds ({(reporteInventario.totalVolumen / 1000).toFixed(2)} Litros).
              </p>
            </div>
            <button className="h-10 w-10 shrink-0 rounded-xl bg-muted/40 text-muted-foreground flex items-center justify-center hover:bg-muted transition-colors cursor-pointer" title="Exportar a PDF">
               <Download className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {reporteInventario.desglose.map((g, i) => {
              const porcentaje = reporteInventario.totalUnidades > 0 
                ? (g.unidades / reporteInventario.totalUnidades) * 100 
                : 0;
              
              const bgColor = g.unidades === 0 ? "bg-red-100" : g.unidades < 5 ? "bg-amber-100" : "bg-emerald-100";
              const fgColor = g.unidades === 0 ? "bg-red-500" : g.unidades < 5 ? "bg-amber-500" : "bg-emerald-500";
              const textColor = g.unidades === 0 ? "text-red-700" : g.unidades < 5 ? "text-amber-700" : "text-emerald-700";

              return (
                <div key={i} className="flex items-center gap-4 bg-muted/20 p-3 rounded-2xl hover:bg-muted/40 transition-colors">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl font-black text-xl text-white shadow-sm ${
                    g.grupo.includes("-") ? "bg-gradient-to-br from-[#1a1210] to-[#3a2018]" : "bg-gradient-to-br from-red-600 to-red-800"
                  }`}>
                    {g.grupo}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <p className={`font-bold text-sm ${textColor}`}>
                         {g.unidades} unidades <span className="text-xs font-semibold opacity-60">({g.volumenTotal} mL)</span>
                       </p>
                       <p className="text-xs font-bold text-muted-foreground">{porcentaje.toFixed(1)}%</p>
                    </div>
                    {/* Tiny visual bar */}
                    <div className={`h-2 w-full rounded-full ${bgColor} overflow-hidden`}>
                       <div style={{ width: `${porcentaje}%` }} className={`h-full ${fgColor} rounded-full transition-all duration-1000`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REPORTE 3: RENDIMIENTO Y DONACIONES (30 DÍAS) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1210] to-[#2d1a14] rounded-3xl p-6 md:p-8 shadow-xl text-white overflow-hidden relative anim-fade-up d4">
           {/* Abstract forms */}
           <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full border-[20px] border-white/5 opacity-50" />
           <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[30px] border-white/5 opacity-50" />
           
           <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-500" /> Productividad 30 Días
                  </h2>
                  <p className="text-sm text-white/50 mt-1">Comportamiento del flujo de recepción y despacho de bolsas de sangre en el mes actual.</p>
                </div>
                <button className="h-10 w-10 shrink-0 rounded-xl bg-white/10 text-white/80 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" title="Exportar a PDF">
                   <Download className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-amber-400 tabular-nums">{reporteDonaciones.total30Dias}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Recolecciones Extras</span>
                 </div>
                 
                 <div className="bg-emerald-500/10 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/20 flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-emerald-400 tabular-nums">{reporteDonaciones.porEstado.disponible}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-400/80">Disponibles Ahora</span>
                 </div>

                 <div className="bg-blue-500/10 backdrop-blur-md rounded-2xl p-5 border border-blue-500/20 flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-blue-400 tabular-nums">{reporteDonaciones.porEstado.utilizada}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-blue-400/80">Transfundidas</span>
                 </div>

                 <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-5 border border-red-500/20 flex flex-col items-center text-center">
                    <span className="text-3xl font-black text-red-500 tabular-nums">{reporteDonaciones.porEstado.descartada + reporteDonaciones.porEstado.vencida}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-red-500/80">Descartadas/Vencidas</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useTransition, useEffect } from "react";
import { generarReporteDonacionesDetallado, getFiltrosCatalogos } from "@/app/actions/reportes";
import { 
  FileText, 
  Calendar, 
  Filter, 
  Printer, 
  Loader2,
  Droplet,
  Tag,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { formatDateSafe } from "@/lib/utils";

export default function ReporteDonacionesPage() {
  const [isPending, startTransition] = useTransition();
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    // Para simplificar MVP se deja la entrada de IDs como un string o un selector manual.
    // Lo ideal seria cargar esto desde API, pero para no saturar dejaremos inputs numericos o vacios
    grupoId: "",
    clasificacionId: ""
  });
  
  const [catalogos, setCatalogos] = useState<{ grupos: any[], clasificaciones: any[] }>({ grupos: [], clasificaciones: [] });
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    getFiltrosCatalogos().then(setCatalogos);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = await generarReporteDonacionesDetallado({
        fechaInicio: filtros.fechaInicio || undefined,
        fechaFin: filtros.fechaFin || undefined,
        grupoId: filtros.grupoId ? parseInt(filtros.grupoId) : undefined,
        clasificacionId: filtros.clasificacionId ? parseInt(filtros.clasificacionId) : undefined
      });
      setResultado(data);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* ── Header Flotante NO imprimible ── */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-5 print:hidden">
        <Link href="/reportes" className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-violet-500" />
            Reporte de Donaciones por Período
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Genere extractos detallados filtrando por rangos de fecha y características cualitativas.
          </p>
        </div>
      </div>

      {/* ── Formulario de Filtros NO imprimible ── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-border/50 print:hidden anim-scale">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-4 border-b pb-3 text-muted-foreground uppercase tracking-wider">
          <Filter className="h-4 w-4" /> Parámetros de Extracción
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block">Fecha Inicio</label>
            <input 
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="w-full rounded-xl bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all border border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Fecha Fin</label>
            <input 
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="w-full rounded-xl bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all border border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Grupo Sanguíneo (Opcional)</label>
            <select 
              value={filtros.grupoId}
              onChange={(e) => setFiltros({ ...filtros, grupoId: e.target.value })}
              className="w-full rounded-xl bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all border border-transparent"
            >
              <option value="">TODOS</option>
              {catalogos.grupos.map((g: any) => (
                <option key={g.id} value={g.id}>{g.grupo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Clasificación (Opcional)</label>
            <select 
              value={filtros.clasificacionId}
              onChange={(e) => setFiltros({ ...filtros, clasificacionId: e.target.value })}
              className="w-full rounded-xl bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all border border-transparent"
            >
              <option value="">TODAS</option>
              {catalogos.clasificaciones.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-violet-700 transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Generar Vista Previa
          </button>
        </div>
      </form>

      {/* ── Vista Previa ── */}
      {resultado && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-border/50 print:p-0 print:border-none print:shadow-none min-h-[500px] anim-fade-up">
          
          <div className="flex justify-between items-start mb-8 print:mb-4 border-b pb-6 print:pb-4 border-black/10">
            <div>
              <h2 className="text-3xl font-black text-black tracking-tight mb-2">REPORTE OFICIAL: DONACIONES POR PERIODO</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-medium text-black/70">
                 <p><span className="font-bold text-black/50 uppercase text-[10px] tracking-widest block">Fecha Generación</span> {formatDateSafe(new Date().toISOString())}</p>
                 <p><span className="font-bold text-black/50 uppercase text-[10px] tracking-widest block">Registros Hallados</span> {resultado.total} donaciones</p>
                 <p><span className="font-bold text-black/50 uppercase text-[10px] tracking-widest block">Período</span> {filtros.fechaInicio ? formatDateSafe(filtros.fechaInicio) : "Histórico"} AL {filtros.fechaFin ? formatDateSafe(filtros.fechaFin) : "Actual"}</p>
                 <p><span className="font-bold text-black/50 uppercase text-[10px] tracking-widest block">Filtros Avanzados</span> 
                    {filtros.grupoId ? catalogos.grupos.find((g: any) => g.id.toString() === filtros.grupoId)?.grupo : 'Todos'} | 
                    {filtros.clasificacionId ? catalogos.clasificaciones.find((c: any) => c.id.toString() === filtros.clasificacionId)?.nombre : 'Todas'}
                 </p>
              </div>
            </div>
            <button onClick={handlePrint} className="h-12 w-12 rounded-full border-2 border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors print:hidden text-black/60 hover:text-black">
              <Printer className="h-5 w-5" />
            </button>
          </div>

          {/* Subtotales Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-6">
             <div>
                <h3 className="text-black font-bold uppercase tracking-widest text-xs border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-red-500" /> Subtotales por Grupo Sanguíneo
                </h3>
                <div className="space-y-1">
                  {Object.entries(resultado.subtotalesGrupo).map(([k, v]: any) => (
                    <div key={k} className="flex justify-between items-center text-sm">
                      <span className="font-semibold">{k}</span>
                      <span className="tabular-nums font-mono bg-black/5 px-2 py-0.5 rounded">{v}</span>
                    </div>
                  ))}
                  {Object.keys(resultado.subtotalesGrupo).length === 0 && <p className="text-xs text-black/40 italic">Sin datos</p>}
                </div>
             </div>
             
             <div>
                <h3 className="text-black font-bold uppercase tracking-widest text-xs border-b border-black/10 pb-2 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-500" /> Subtotales por Clasificación
                </h3>
                <div className="space-y-1">
                  {Object.entries(resultado.subtotalesClasif).map(([k, v]: any) => (
                    <div key={k} className="flex justify-between items-center text-sm">
                      <span className="font-semibold">{k}</span>
                      <span className="tabular-nums font-mono bg-black/5 px-2 py-0.5 rounded">{v}</span>
                    </div>
                  ))}
                  {Object.keys(resultado.subtotalesClasif).length === 0 && <p className="text-xs text-black/40 italic">Sin datos</p>}
                </div>
             </div>
          </div>

          {/* Table */}
          <h3 className="text-black font-bold uppercase tracking-widest text-xs mb-3">Listado Detallado de Registros</h3>
          <div className="overflow-x-auto w-full pb-4">
            <table className="w-full text-sm text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-y-2 border-black/20 text-black font-bold bg-black/5 print:bg-transparent">
                  <th className="py-3 px-2">Código Lote</th>
                  <th className="py-3 px-2">Recolección</th>
                  <th className="py-3 px-2">Donante</th>
                  <th className="py-3 px-2">Grupo</th>
                  <th className="py-3 px-2">Clasificación</th>
                  <th className="py-3 px-2 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {resultado.donaciones.map((d: any) => (
                  <tr key={d.id} className="hover:bg-black/5 print:hover:bg-transparent transition-colors">
                    <td className="py-2.5 px-2 font-mono font-bold text-xs">{d.codigo}</td>
                    <td className="py-2.5 px-2">{formatDateSafe(d.fecha)}</td>
                    <td className="py-2.5 px-2 truncate max-w-[200px]">{d.donante.nombres} {d.donante.apellidos}</td>
                    <td className="py-2.5 px-2">
                      <span className="bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded shadow-sm text-xs print:border print:border-black/20 print:bg-transparent print:text-black">{d.grupoSanguineo?.grupo || "S/R"}</span>
                    </td>
                    <td className="py-2.5 px-2 text-xs">{d.clasificacion?.nombre || "-"}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-xs">{Number(d.cantidadMl)}mL</td>
                  </tr>
                ))}
                {resultado.donaciones.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-black/50 italic">
                      No hubo recolecciones registradas en este período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Print Only */}
          <div className="hidden print:block text-center text-xs text-black/50 mt-12 pt-4 border-t border-black/10">
            FIN DEL REPORTE • SISTEMA DE GESTIÓN BANCO DE SANGRE • {new Date().getFullYear()}
          </div>
        </div>
      )}
      
      {/* Estilos específicos para impresión */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}

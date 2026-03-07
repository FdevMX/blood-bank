"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCircle2, 
  Droplet, 
  Settings2, 
  Activity, 
  Loader2,
  AlertCircle,
  FlaskConical,
  Stethoscope
} from "lucide-react";
import { crearDonacion } from "@/app/actions/donaciones"; 

interface CatalogItem {
  id: number;
  nombre?: string;
  grupo?: string;
  descripcion: string | null;
}

interface DonanteItem {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  documentoIdentidad: string | null;
  idGrupoSanguineo: number | null;
}

interface DonacionFormProps {
  clasificaciones: CatalogItem[];
  grupos: CatalogItem[];
  donantes: DonanteItem[];
  defaultDonanteId?: number;
}

export function DonacionForm({ clasificaciones, grupos, donantes, defaultDonanteId }: DonacionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    idDonante: defaultDonanteId ? defaultDonanteId.toString() : "",
    fecha: new Date().toISOString().split('T')[0], // Defaults to today YYYY-MM-DD
    cantidadMl: "450", // Volumen promedio de flebotomía
    idGrupoSanguineo: "", 
    idClasificacion: "",
    temperatura: "",
    peso: "",
    tensionArterial: "",
    hemoglobina: "",
    lso: "",
    observaciones: "",
  });

  // Al seleccionar el donante, podemos inferir su grupo si ya lo tiene.
  useEffect(() => {
    if (formData.idDonante) {
      const don = donantes.find(d => d.id.toString() === formData.idDonante);
      if (don && don.idGrupoSanguineo) {
         setFormData(prev => ({ ...prev, idGrupoSanguineo: don.idGrupoSanguineo!.toString() }));
      }
    }
  }, [formData.idDonante, donantes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      const resp = await crearDonacion(formData);
      if (resp?.error) {
        setError(resp.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (resp?.success) {
        router.push(`/donaciones`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32">
      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700 anim-scale">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error en la validación</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* ── SECCIÓN PRIMARIA: Identificación de Origen ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-rose-600" /> Donante Origen
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-1.5 block">Seleccione el Donante Apto *</label>
            <div className="relative">
              <select 
                name="idDonante" 
                value={formData.idDonante} 
                onChange={handleChange} 
                required
                className="w-full appearance-none rounded-xl bg-muted/30 px-4 py-3.5 pr-10 text-[15px] outline-none border border-transparent focus:border-rose-500/30 focus:bg-white transition-all text-foreground font-medium"
              >
                <option value="">-- Buscar persona en el registro --</option>
                {donantes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.codigo} | {d.nombres} {d.apellidos} {d.documentoIdentidad ? `(ID: ${d.documentoIdentidad})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50">▼</div>
            </div>
            {defaultDonanteId && (
              <p className="text-xs text-rose-600 font-bold mt-2">← Donante pre-seleccionado desde Evaluación Clínica.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── SECCIÓN CENTRAL: Fraccionamiento Físico ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-rose-600" /> Unidad de Sangre
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FormInput label="Fecha Colección *" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
          <FormInput label="Volumen Recolectado (mL) *" name="cantidadMl" type="number" step="0.01" value={formData.cantidadMl} onChange={handleChange} required />
          
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Grupo Sanguíneo Confirmado</label>
            <div className="relative">
              <select name="idGrupoSanguineo" value={formData.idGrupoSanguineo} onChange={handleChange} className="w-full appearance-none rounded-xl bg-muted/30 px-4 py-3 pr-10 text-sm outline-none border border-transparent focus:border-rose-500/30 focus:bg-white transition-all text-red-700 font-bold">
                <option value="">-- Autocompletado del donante o definir --</option>
                {grupos.map((g) => <option key={g.id} value={g.id}>{g.grupo}</option>)}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-semibold mb-1.5 block">Clasificación Post-Extracción *</label>
            <div className="relative">
              <select name="idClasificacion" required value={formData.idClasificacion} onChange={handleChange} className="w-full appearance-none rounded-xl bg-muted/30 px-4 py-3 pr-10 text-sm outline-none border border-transparent focus:border-rose-500/30 focus:bg-white transition-all text-foreground">
                <option value="">-- Estado inicial --</option>
                {clasificaciones.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN: Constantes Vitales en Extracción ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 relative overflow-hidden">
        <Activity className="absolute bottom-[-20%] right-[-5%] h-64 w-64 text-muted/30 z-0 pointer-events-none" />
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
          <Stethoscope className="h-5 w-5 text-rose-600" /> Signos Vitales al Momento
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          <FormInput label="Peso (Kg) *" name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} required placeholder="70.5" />
          <FormInput label="Temper. (°C) *" name="temperatura" type="number" step="0.1" value={formData.temperatura} onChange={handleChange} required placeholder="36.5" />
          <FormInput label="Tensión Arterial *" name="tensionArterial" value={formData.tensionArterial} onChange={handleChange} required placeholder="120/80" />
          <FormInput label="Hemoglobina *" name="hemoglobina" type="number" step="0.1" value={formData.hemoglobina} onChange={handleChange} required placeholder="14.2" />
        </div>
      </div>
      
      {/* ── SECCIÓN: Trazabilidad ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-rose-600" /> Trazabilidad y LSO
        </h3>
        <div className="space-y-5">
          <FormInput label="Lote de Sistema (LSO)" name="lso" value={formData.lso} onChange={handleChange} placeholder="LSO-8921-X" />
          
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Observaciones Clínicas / Reacciones Adversas</label>
            <textarea 
              name="observaciones" rows={3} value={formData.observaciones} onChange={handleChange}
              placeholder="Desmayo leve, punción difícil en brazo izquierdo, etc."
              className="w-full rounded-xl bg-muted/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-rose-500/30 focus:bg-white transition-all resize-none" 
            />
          </div>
        </div>
      </div>

      {/* ── Acciones Flotantes ── */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-[260px] p-6 md:p-8 bg-white/80 backdrop-blur-xl rounded-t-3xl border-t border-border/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 py-3 text-sm font-black text-white shadow-xl shadow-rose-900/30 hover:shadow-2xl hover:bg-rose-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 tracking-wide"
        >
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> PROCESANDO...</> : "REGISTRAR EXTRACCIÓN AL INVENTARIO"}
        </button>
      </div>

    </form>
  );
}

// Sub-Componente de Input reutilizable
function FormInput({ label, name, type = "text", value, onChange, required, placeholder, icon, className = "", step }: any) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} step={step}
          className={`w-full rounded-xl bg-muted/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-rose-500/30 focus:bg-white transition-all text-foreground ${icon ? "pl-11" : ""}`} 
        />
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
      </div>
    </div>
  );
}

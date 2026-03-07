"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCircle2, 
  MapPin, 
  Phone, 
  Briefcase, 
  Droplet, 
  Activity, 
  Stethoscope,
  Tags,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import { crearDonante, actualizarDonante } from "@/app/actions/donantes";

interface CatalogItem {
  id: number;
  nombre?: string;
  grupo?: string;
  descripcion: string | null;
}

interface DonanteFormProps {
  initialData?: any; // For editing later
  tipos: CatalogItem[];
  grupos: CatalogItem[];
  enfermedadesCatalog: CatalogItem[];
}

export function DonanteForm({ initialData, tipos, grupos, enfermedadesCatalog }: DonanteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nombres: initialData?.nombres || "",
    apellidos: initialData?.apellidos || "",
    documentoIdentidad: initialData?.documentoIdentidad || "",
    fechaNacimiento: initialData?.fechaNacimiento ? new Date(initialData.fechaNacimiento).toISOString().split('T')[0] : "",
    sexo: initialData?.sexo || "MASCULINO",
    ocupacion: initialData?.ocupacion || "",
    centroTrabajo: initialData?.centroTrabajo || "",
    direccion: initialData?.direccion || "",
    municipio: initialData?.municipio || "",
    departamento: initialData?.departamento || "",
    telefono: initialData?.telefono || "",
    email: initialData?.email || "",
    temperatura: initialData?.temperatura ? initialData.temperatura.toString() : "",
    idTipoDonante: initialData?.idTipoDonante ? initialData.idTipoDonante.toString() : "",
    idGrupoSanguineo: initialData?.idGrupoSanguineo ? initialData.idGrupoSanguineo.toString() : "",
    transfusionesPrevias: initialData?.transfusionesPrevias ? "true" : "false",
    donacionesPrevias: initialData?.donacionesPrevias ? "true" : "false",
  });
  
  // Array of selected disease IDs
  const [enfermedades, setEnfermedades] = useState<number[]>(initialData?.enfermedades?.map((e: any) => e.idEnfermedad) || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEnfermedad = (id: number) => {
    setEnfermedades(prev => 
      prev.includes(id) ? prev.filter((eId: number) => eId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      let resp;
      if (initialData) {
        resp = await actualizarDonante(initialData.id, formData, enfermedades);
      } else {
        resp = await crearDonante(formData, enfermedades);
      }
      
      if (resp?.error) {
        setError(resp.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (resp?.success) {
        router.push(`/donantes/${initialData ? initialData.id : resp.id}`);
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
            <p className="font-bold">Error al procesar</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* ── SECCIÓN: Datos Personales ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-teal-600" /> Datos Personales
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Nombres *" name="nombres" value={formData.nombres} onChange={handleChange} required placeholder="Juan Carlos" />
          <FormInput label="Apellidos *" name="apellidos" value={formData.apellidos} onChange={handleChange} required placeholder="Pérez González" />
          <FormInput label="INE/Pasaporte *" name="documentoIdentidad" value={formData.documentoIdentidad} onChange={handleChange} required placeholder="0801-1990-12345" />
          <FormInput label="Fecha Nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} />
          
          <div className="col-span-1">
            <label className="text-sm font-semibold mb-1.5 block">Sexo *</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer rounded-xl border flex items-center justify-center py-3 text-sm font-bold transition-all ${
                formData.sexo === "MASCULINO" ? "bg-teal-50 border-teal-500 text-teal-700 shadow-inner" : "bg-muted/30 border-transparent hover:bg-muted/50"
              }`}>
                <input type="radio" name="sexo" value="MASCULINO" checked={formData.sexo === "MASCULINO"} onChange={handleChange} className="hidden" />
                MASCULINO
              </label>
              <label className={`cursor-pointer rounded-xl border flex items-center justify-center py-3 text-sm font-bold transition-all ${
                formData.sexo === "FEMENINO" ? "bg-rose-50 border-rose-500 text-rose-700 shadow-inner" : "bg-muted/30 border-transparent hover:bg-muted/50"
              }`}>
                <input type="radio" name="sexo" value="FEMENINO" checked={formData.sexo === "FEMENINO"} onChange={handleChange} className="hidden" />
                FEMENINO
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN: Contacto y Ubicación ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal-600" /> Contacto y Ubicación
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-sm font-semibold mb-1.5 block">Dirección Residencia</label>
            <textarea 
              name="direccion" rows={2} value={formData.direccion} onChange={handleChange}
              placeholder="Colonia, calle, referencia..."
              className="w-full rounded-xl bg-muted/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-teal-500/30 focus:bg-white transition-all resize-none" 
            />
          </div>
          <FormInput label="Departamento" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Francisco Morazán" />
          <FormInput label="Municipio *" name="municipio" value={formData.municipio} onChange={handleChange} required placeholder="Distrito Central" />
          <FormInput label="Teléfono *" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required placeholder="9988-7766" icon={<Phone className="h-4 w-4 text-muted-foreground" />} />
          <FormInput label="Correo Electrónico *" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="juan@ejemplo.com" className="sm:col-span-2" />
        </div>
      </div>

      {/* ── SECCIÓN: Laboral ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-teal-600" /> Laboral
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput label="Ocupación *" name="ocupacion" value={formData.ocupacion} onChange={handleChange} required placeholder="Ingeniero, Estudiante..." />
          <FormInput label="Centro de Trabajo/Estudio" name="centroTrabajo" value={formData.centroTrabajo} onChange={handleChange} placeholder="UNA, Empresa SA..." />
        </div>
      </div>

      {/* ── SECCIÓN: Perfil Donante ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Droplet className="h-5 w-5 text-teal-600" /> Perfil de Donación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Tipo de Donante *</label>
            <div className="relative">
              <select name="idTipoDonante" required value={formData.idTipoDonante} onChange={handleChange} className="w-full appearance-none rounded-xl bg-muted/30 px-4 py-3 pr-10 text-sm outline-none border border-transparent focus:border-teal-500/30 focus:bg-white transition-all text-foreground">
                <option value="">-- Seleccionar --</option>
                {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <Tags className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Grupo Sanguíneo *</label>
            <div className="relative">
              <select name="idGrupoSanguineo" required value={formData.idGrupoSanguineo} onChange={handleChange} className="w-full appearance-none rounded-xl bg-muted/30 px-4 py-3 pr-10 text-sm outline-none border border-transparent focus:border-teal-500/30 focus:bg-white transition-all text-red-700 font-bold">
                <option value="">-- Desconocido --</option>
                {grupos.map((g) => <option key={g.id} value={g.id}>{g.grupo}</option>)}
              </select>
              <Droplet className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-muted/20 border border-muted/50">
          <div>
            <label className="text-sm font-semibold mb-2 block">¿Donaciones previas?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="donacionesPrevias" value="true" checked={formData.donacionesPrevias === "true"} onChange={handleChange} className="accent-teal-600 h-4 w-4" /> Sí
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="donacionesPrevias" value="false" checked={formData.donacionesPrevias === "false"} onChange={handleChange} className="accent-teal-600 h-4 w-4" /> No
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">¿Transfusiones recientes?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="transfusionesPrevias" value="true" checked={formData.transfusionesPrevias === "true"} onChange={handleChange} className="accent-rose-600 h-4 w-4" /> Sí
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="transfusionesPrevias" value="false" checked={formData.transfusionesPrevias === "false"} onChange={handleChange} className="accent-rose-600 h-4 w-4" /> No
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN: Historial Médico / Enfermedades ── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-teal-600" /> Historial Médico
        </h3>
        
        <div className="mb-6">
          <FormInput label="Temperatura (°C) - Previa *" name="temperatura" type="number" step="0.1" required value={formData.temperatura} onChange={handleChange} placeholder="36.5" />
        </div>

        <label className="text-sm font-semibold mb-3 block border-t pt-6">Seleccionar Enfermedades o Condiciones Excluyentes (Si aplica)</label>
        {enfermedadesCatalog.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-xl">No hay enfermedades en el catálogo.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enfermedadesCatalog.map((enf) => {
              const objSeleted = enfermedades.includes(enf.id);
              return (
                <button
                  type="button"
                  key={enf.id}
                  onClick={() => toggleEnfermedad(enf.id)}
                  className={`flex items-start text-left gap-3 p-3 rounded-xl border transition-all ${
                    objSeleted 
                      ? "bg-rose-50 border-rose-200 shadow-sm" 
                      : "bg-white border-border hover:bg-muted/30"
                  }`}
                >
                  <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    objSeleted ? "bg-rose-500 border-rose-500" : "bg-white border-input"
                  }`}>
                    {objSeleted && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${objSeleted ? "text-rose-900" : "text-foreground"}`}>{enf.nombre}</p>
                    {enf.descripcion && <p className={`text-xs mt-0.5 line-clamp-2 ${objSeleted ? "text-rose-700/80" : "text-muted-foreground"}`}>{enf.descripcion}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Acciones Flotantes ── */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-[260px] p-6 md:p-8 bg-white rounded-3xl border border-border/50 shadow-sm z-10 flex justify-end gap-3">
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
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-teal-900/30 hover:shadow-2xl hover:bg-teal-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</> : (initialData ? "Actualizar Expediente Clínico" : "Guardar Expediente Clínico")}
        </button>
      </div>

    </form>
  );
}

// Sub-Componente de Input reutilizable y bonito
function FormInput({ label, name, type = "text", value, onChange, required, placeholder, icon, className = "", step }: any) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} step={step}
          className={`w-full rounded-xl bg-muted/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 border border-transparent focus:border-teal-500/30 focus:bg-white transition-all text-foreground ${icon ? "pl-11" : ""}`} 
        />
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
      </div>
    </div>
  );
}

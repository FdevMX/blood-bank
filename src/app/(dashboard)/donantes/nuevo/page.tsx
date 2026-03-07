import { getTiposDonante, getGruposSanguineos, getEnfermedades } from "@/app/actions/catalogos";
import { DonanteForm } from "@/components/donantes/DonanteForm";
import { HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevoDonantePage() {
  const [tipos, grupos, enfermedades] = await Promise.all([
    getTiposDonante(),
    getGruposSanguineos(),
    getEnfermedades()
  ]);

  // Filtrar registros activos
  const tiposActivos = tipos.filter((t) => t.activo);
  const gruposActivos = grupos.filter((g) => g.activo);
  const enfermedadesActivas = enfermedades.filter((e) => e.activo);

  return (
    <div className="max-w-4xl mx-auto space-y-6 anim-fade-up d1">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <HeartHandshake className="h-8 w-8 text-teal-500" />
          Registrar Donante
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete el expediente clínico del nuevo donante de sangre. Los campos con * son obligatorios.
        </p>
      </div>

      <DonanteForm 
        tipos={tiposActivos} 
        grupos={gruposActivos} 
        enfermedadesCatalog={enfermedadesActivas} 
      />
    </div>
  );
}

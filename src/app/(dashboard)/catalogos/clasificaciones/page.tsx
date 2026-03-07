import { CatalogoTable } from "@/components/catalogos/CatalogoTable";
import { getClasificaciones, crearClasificacion, editarClasificacion,
  toggleClasificacion,
  eliminarClasificacion
} from "@/app/actions/catalogos";

export const dynamic = "force-dynamic";

export default async function ClasificacionesPage() {
  const items = await getClasificaciones();

  return (
    <div className="anim-fade-up d1">
      <h2 className="text-xl font-bold mb-4">Clasificación de Donación</h2>
      <CatalogoTable
        items={items}
        nameKey="nombre"
        nameLabel="Clasificación"
        namePlaceholder="Ej: ÚTIL, NO ÚTIL..."
        usageLabel="Donaciones"
        onCrear={crearClasificacion as any}
        onEditar={editarClasificacion as any}
        onToggle={toggleClasificacion}
        onEliminar={eliminarClasificacion}
      />
    </div>
  );
}

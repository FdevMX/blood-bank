import { CatalogoTable } from "@/components/catalogos/CatalogoTable";
import { getEnfermedades, crearEnfermedad, editarEnfermedad,
  toggleEnfermedad,
  eliminarEnfermedad
} from "@/app/actions/catalogos";

export const dynamic = "force-dynamic";

export default async function EnfermedadesPage() {
  const items = await getEnfermedades();

  return (
    <div className="anim-fade-up d1">
      <h2 className="text-xl font-bold mb-4">Enfermedades Recientes</h2>
      <CatalogoTable
        items={items}
        nameKey="nombre"
        nameLabel="Enfermedad"
        namePlaceholder="Ej: Hepatitis C, Sífilis..."
        usageLabel="Donantes Afectados"
        onCrear={crearEnfermedad as any}
        onEditar={editarEnfermedad as any}
        onToggle={toggleEnfermedad}
        onEliminar={eliminarEnfermedad}
      />
    </div>
  );
}

import { CatalogoTable } from "@/components/catalogos/CatalogoTable";
import { getTiposDonante, crearTipoDonante, editarTipoDonante, toggleTipoDonante, eliminarTipoDonante } from "@/app/actions/catalogos";

export const dynamic = "force-dynamic";

export default async function TiposDonantePage() {
  const items = await getTiposDonante();

  return (
    <div className="anim-fade-up d1">
      <h2 className="text-xl font-bold mb-4">Tipos de Donante</h2>
      <CatalogoTable
        items={items}
        nameKey="nombre"
        nameLabel="Tipo"
        namePlaceholder="Ej: Voluntario, Reposición..."
        usageLabel="Asignados"
        onCrear={crearTipoDonante as any}
        onEditar={editarTipoDonante as any}
        onToggle={toggleTipoDonante}
        onEliminar={eliminarTipoDonante}
      />
    </div>
  );
}

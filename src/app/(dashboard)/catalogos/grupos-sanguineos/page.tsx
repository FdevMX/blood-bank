import { CatalogoTable } from "@/components/catalogos/CatalogoTable";
import { getGruposSanguineos, crearGrupoSanguineo,  editarGrupoSanguineo,
  toggleGrupoSanguineo,
  eliminarGrupoSanguineo
} from "@/app/actions/catalogos";

export const dynamic = "force-dynamic";

export default async function GruposSanguineosPage() {
  const items = await getGruposSanguineos();

  return (
    <div className="anim-fade-up d1">
      <h2 className="text-xl font-bold mb-4">Grupos Sanguíneos</h2>
      <CatalogoTable
        items={items}
        nameKey="grupo"
        nameLabel="Grupo"
        namePlaceholder="Ej: A+, O-..."
        usageLabel="Unidades/Donantes"
        onCrear={crearGrupoSanguineo as any}
        onEditar={editarGrupoSanguineo as any}
        onToggle={toggleGrupoSanguineo}
        onEliminar={eliminarGrupoSanguineo}
      />
    </div>
  );
}

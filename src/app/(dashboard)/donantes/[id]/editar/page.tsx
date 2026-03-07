import { getDonanteDetalle } from "@/app/actions/donantes";
import { getGruposSanguineos, getTiposDonante, getEnfermedades } from "@/app/actions/catalogos";
import { DonanteForm } from "@/components/donantes/DonanteForm";
import { UserCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarDonantePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const donanteId = parseInt(id);

  if (isNaN(donanteId)) return notFound();

  const [donante, tipos, grupos, enfermedades] = await Promise.all([
    getDonanteDetalle(donanteId),
    getTiposDonante(),
    getGruposSanguineos(),
    getEnfermedades(),
  ]);

  if (!donante) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6 anim-fade-up d1">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <UserCircle2 className="h-8 w-8 text-teal-600" />
            Editar Expediente Médico
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modificando el registro de {donante.nombres} {donante.apellidos} ({donante.codigo}).
          </p>
        </div>
      </div>

      <DonanteForm 
        initialData={donante}
        tipos={tipos}
        grupos={grupos}
        enfermedadesCatalog={enfermedades}
      />
    </div>
  );
}

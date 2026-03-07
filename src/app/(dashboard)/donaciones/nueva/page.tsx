import { getClasificaciones, getGruposSanguineos } from "@/app/actions/catalogos";
import prisma from "@/lib/prisma";
import { DonacionForm } from "@/components/donaciones/DonacionForm";
import { FlaskConical } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NuevaDonacionPage({
  searchParams,
}: {
  searchParams: Promise<{ donanteId?: string }>;
}) {
  const { donanteId } = await searchParams;

  const enfermedadesExcluyentes = ["Hepatitis B", "Hepatitis C", "Sífilis", "VIH", "Chagas"];
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
  const cuatroMesesAtras = new Date();
  cuatroMesesAtras.setMonth(cuatroMesesAtras.getMonth() - 4);

  const [clasificaciones, grupos, donantes] = await Promise.all([
    getClasificaciones(),
    getGruposSanguineos(),
    // Para simplificar, cargamos solo donantes ACTIVOS y ELEGIBLES.
    prisma.donante.findMany({
      where: { 
        estado: "activo",
        transfusionesPrevias: false,
        enfermedades: {
          none: { enfermedad: { nombre: { in: enfermedadesExcluyentes } } }
        },
        OR: [
          { fechaUltimaDonacion: null },
          { sexo: "MASCULINO", fechaUltimaDonacion: { lte: tresMesesAtras } },
          { sexo: "FEMENINO", fechaUltimaDonacion: { lte: cuatroMesesAtras } }
        ]
      },
      orderBy: { nombres: "asc" },
      select: { id: true, nombres: true, apellidos: true, codigo: true, documentoIdentidad: true, idGrupoSanguineo: true }
    })
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 anim-fade-up d1">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <FlaskConical className="h-8 w-8 text-rose-500" />
          Registrar Extracción de Sangre
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete la trazabilidad clínica y operativa de la recolección. El vencimiento se calculará automáticamente a 35 días.
        </p>
      </div>

      <DonacionForm 
        clasificaciones={clasificaciones.filter((c: any) => c.activo)} 
        grupos={grupos.filter((g: any) => g.activo)} 
        donantes={donantes as any}
        defaultDonanteId={donanteId ? parseInt(donanteId) : undefined}
      />
    </div>
  );
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { registrarAuditoria } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────
// OBTENER DONACIONES (PAGINADAS Y CON BÚSQUEDA)
// ─────────────────────────────────────────────────────────
export async function getDonaciones(busqueda?: string, pagina: number = 1, limite: number = 20, tab: string = "Todos") {
  const skip = (pagina - 1) * limite;
  
  const searchWhere = busqueda ? {
    OR: [
      { codigo: { contains: busqueda, mode: "insensitive" as const } },
      { donante: { nombres: { contains: busqueda, mode: "insensitive" as const } } },
      { donante: { apellidos: { contains: busqueda, mode: "insensitive" as const } } },
      { lso: { contains: busqueda, mode: "insensitive" as const } }
    ]
  } : {};

  let tabWhere: any = {};
  if (tab === "Donaciones Disponibles") tabWhere = { estado: "disponible" };
  else if (tab === "Donaciones Utilizadas") tabWhere = { estado: "utilizada" };
  else if (tab === "Donaciones Descartadas") tabWhere = { estado: "descartada" };
  else if (tab === "Donaciones Vencidas") tabWhere = { estado: "vencida" };

  const whereClausula = {
    AND: [searchWhere, tabWhere]
  };

  const [total, donaciones] = await Promise.all([
    prisma.donacion.count({ where: whereClausula }),
    prisma.donacion.findMany({
      where: whereClausula,
      skip,
      take: limite,
      orderBy: { fechaRegistro: "desc" },
      include: {
        donante: { select: { nombres: true, apellidos: true, codigo: true, documentoIdentidad: true } },
        grupoSanguineo: { select: { grupo: true } },
        clasificacion: { select: { nombre: true } }
      }
    })
  ]);

  return {
    donaciones,
    total,
    paginas: Math.ceil(total / limite)
  };
}

// ─────────────────────────────────────────────────────────
// OBTENER DETALLE DE UNA DONACIÓN (POR ID)
// ─────────────────────────────────────────────────────────
export async function getDonacionDetalle(id: number) {
  return prisma.donacion.findUnique({
    where: { id },
    include: {
      donante: true,
      grupoSanguineo: true,
      tipoDonante: true,
      clasificacion: true,
      usuarioRegistro: {
        select: {
          nombreUsuario: true
        }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────
// CREAR DONACIÓN (FRACCIONAMIENTO INICIAL)
// ─────────────────────────────────────────────────────────
export async function crearDonacion(data: any) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado." };

  const idDonante = parseInt(data.idDonante);
  if (isNaN(idDonante)) return { error: "Donante inválido." };

  // Obtener información del donante para rellenar datos faltantes
  const donante = await prisma.donante.findUnique({
    where: { id: idDonante }
  });

  if (!donante) return { error: "No se encontró el donante." };
  if (donante.estado === "inactivo") return { error: "El donante está inactivo." };

  // Generar código único para la unidad de sangre (ej: UN-2026-X8A9)
  const anio = new Date().getFullYear();
  const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
  const codigo = `UN-${anio}-${hex}`;

  // Calcular fecha de vencimiento (Estándar 35 o 42 días dependiendo de conservantes. Usaremos 35 días como base clínica).
  const fecha = data.fecha ? new Date(`${data.fecha}T12:00:00Z`) : new Date();
  const msPorDia = 24 * 60 * 60 * 1000;
  const fechaVencimiento = new Date(fecha.getTime() + (35 * msPorDia));
  
  // Utilizar la fecha actual para la captura de 'hora' en tipo DateTime según Prisma
  // (Prisma db.Time lo maneja extrayendo el tiempo del DateTime).
  const horaCaptura = new Date();

  const nuevaDonacion = await prisma.$transaction(async (tx: any) => {
    // 1. Crear el registro de la donación/unidad
    const donacion = await tx.donacion.create({
      data: {
        codigo,
        idDonante,
        fecha,
        hora: horaCaptura,
        cantidadMl: data.cantidadMl ? parseFloat(data.cantidadMl) : 450.00,
        peso: data.peso ? parseFloat(data.peso) : null,
        temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
        hemoglobina: data.hemoglobina ? parseFloat(data.hemoglobina) : null,
        tensionArterial: data.tensionArterial || null,
        lso: data.lso || null,
        observaciones: data.observaciones || null,
        // Si no se específica explícitamente, hereda del perfil del donante
        idGrupoSanguineo: data.idGrupoSanguineo ? parseInt(data.idGrupoSanguineo) : donante.idGrupoSanguineo,
        idTipoDonante: donante.idTipoDonante, 
        idClasificacion: data.idClasificacion ? parseInt(data.idClasificacion) : null,
        fechaVencimiento,
        estado: "disponible",
        idUsuarioRegistro: Number(session.user.id)
      }
    });

    // 2. Actualizar el perfil del donante (última fecha de donación y donaciones previas)
    await tx.donante.update({
      where: { id: idDonante },
      data: { 
        fechaUltimaDonacion: fecha,
        donacionesPrevias: true
      }
    });

    return donacion;
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "donacion",
    registroId: nuevaDonacion.id,
    datosNuevos: nuevaDonacion,
  });

  revalidatePath("/donaciones");
  revalidatePath("/donantes");
  revalidatePath(`/donantes/${idDonante}`);

  return { success: true, id: nuevaDonacion.id };
}

// ─────────────────────────────────────────────────────────
// CAMBIAR ESTADO DE LA UNIDAD SANGUÍNEA (EJ. DESCARTARLA)
// ─────────────────────────────────────────────────────────
export async function actualizarEstadoDonacion(id: number, nuevoEstado: string, justificacion?: string) {
  const session = await auth();
  if (!session?.user || session.user.rol === "consulta") return { error: "No autorizado para esta acción." };

  const anterior = await prisma.donacion.findUnique({ where: { id } });
  if (!anterior) return { error: "Donación no encontrada." };

  const registro = await prisma.donacion.update({
    where: { id },
    data: { 
      estado: nuevoEstado as any,
      observaciones: justificacion ? `${anterior.observaciones ? anterior.observaciones + '\n' : ''}[${new Date().toLocaleDateString()}] Cambio de estado a ${nuevoEstado}: ${justificacion}` : anterior.observaciones
    }
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "donacion",
    registroId: id,
    datosAnteriores: { estado: anterior.estado },
    datosNuevos: { estado: registro.estado, observaciones: registro.observaciones },
  });

  revalidatePath("/donaciones");
  return { success: true };
}

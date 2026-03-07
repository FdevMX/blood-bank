"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { registrarAuditoria } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────
// OBTENER DONANTES (CON BÚSQUEDA Y PAGINACIÓN Y PESTAÑAS)
// ─────────────────────────────────────────────────────────
export async function getDonantes(busqueda?: string, pagina: number = 1, limite: number = 20, tab: string = "Todos") {
  const skip = (pagina - 1) * limite;
  
  const searchWhere = busqueda ? {
    OR: [
      { codigo: { contains: busqueda, mode: "insensitive" as const } },
      { nombres: { contains: busqueda, mode: "insensitive" as const } },
      { apellidos: { contains: busqueda, mode: "insensitive" as const } },
      { documentoIdentidad: { contains: busqueda, mode: "insensitive" as const } }
    ]
  } : {};

  let tabWhere: any = {};
  const enfermedadesExcluyentes = ["Hepatitis B", "Hepatitis C", "Sífilis", "VIH", "Chagas"];
  
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
  
  const cuatroMesesAtras = new Date();
  cuatroMesesAtras.setMonth(cuatroMesesAtras.getMonth() - 4);

  if (tab === "Donantes Activos") {
    tabWhere = { estado: "activo" };
  } else if (tab === "Donantes Desactivados") {
    tabWhere = { estado: "inactivo" };
  } else if (tab === "Donantes Elegibles") {
    tabWhere = {
      estado: "activo",
      transfusionesPrevias: false,
      enfermedades: {
        none: {
          enfermedad: {
            nombre: { in: enfermedadesExcluyentes }
          }
        }
      },
      OR: [
        { fechaUltimaDonacion: null },
        { sexo: "MASCULINO", fechaUltimaDonacion: { lte: tresMesesAtras } },
        { sexo: "FEMENINO", fechaUltimaDonacion: { lte: cuatroMesesAtras } }
      ]
    };
  } else if (tab === "Donantes No Elegibles") {
    // Esencialmente la negación de la elegibilidad
    tabWhere = {
      estado: "activo",
      OR: [
        { transfusionesPrevias: true },
        { 
          enfermedades: {
            some: {
              enfermedad: {
                nombre: { in: enfermedadesExcluyentes }
              }
            }
          }
        },
        { sexo: "MASCULINO", fechaUltimaDonacion: { gt: tresMesesAtras } },
        { sexo: "FEMENINO", fechaUltimaDonacion: { gt: cuatroMesesAtras } }
      ]
    };
  }

  const whereClausula = {
    AND: [searchWhere, tabWhere]
  };

  const [total, donantes] = await Promise.all([
    prisma.donante.count({ where: whereClausula }),
    prisma.donante.findMany({
      where: whereClausula,
      skip,
      take: limite,
      orderBy: { fechaRegistro: "desc" },
      include: {
        grupoSanguineo: { select: { grupo: true } },
        tipoDonante: { select: { nombre: true } }
      }
    })
  ]);

  return {
    donantes,
    total,
    paginas: Math.ceil(total / limite)
  };
}

// ─────────────────────────────────────────────────────────
// OBTENER DETALLE CLÍNICO DE UN DONANTE (POR ID)
// ─────────────────────────────────────────────────────────
export async function getDonanteDetalle(id: number) {
  return prisma.donante.findUnique({
    where: { id },
    include: {
      grupoSanguineo: true,
      tipoDonante: true,
      enfermedades: {
        include: { enfermedad: true },
        orderBy: { fechaDiagnostico: "desc" }
      },
      donaciones: {
        orderBy: { fecha: "desc" },
        take: 5,
        include: { grupoSanguineo: true }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────
// CÁLCULO DE ELEGIBILIDAD MÉDICA BÁSICA
// ─────────────────────────────────────────────────────────
export async function evaluarElegibilidad(donante: any) {
  // 1. Estado inactivo
  if (donante.estado === "inactivo") return { elegible: false, motivo: "Donante inactivo temporal o permanentemente." };

  // 2. Tiempo desde la última donación
  if (donante.fechaUltimaDonacion) {
    const mesesPasados = (new Date().getTime() - new Date(donante.fechaUltimaDonacion).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    const mesesRequeridos = donante.sexo === "MASCULINO" ? 3 : 4; // Hombres 3 meses, Mujeres 4 meses
    if (mesesPasados < mesesRequeridos) {
      return { 
        elegible: false, 
        motivo: `Aún no han pasado ${mesesRequeridos} meses desde su última donación según su sexo.` 
      };
    }
  }

  // 3. Transfusiones previas recientes (Se asume que es excluyente por un año mínimo, aquí bloqueamos si está marcado por seguridad)
  if (donante.transfusionesPrevias) {
    return { elegible: false, motivo: "Requiere evaluación médica especial por antecedente de transfusiones." };
  }

  // 4. Enfermedades exclusorias absolutas/temporales (Simplificado)
  const enfermedadesExcluyentes = ["Hepatitis B", "Hepatitis C", "Sífilis", "VIH", "Chagas"];
  const tieneEnfermedadGrave = donante.enfermedades?.some((e: any) => 
    enfermedadesExcluyentes.some(ex => e.enfermedad.nombre.toLowerCase().includes(ex.toLowerCase()))
  );
  if (tieneEnfermedadGrave) {
    return { elegible: false, motivo: "Exclusión permanente por antecedente de enfermedad infecciosa." };
  }

  return { elegible: true, motivo: "Apto para donación clínica." };
}

// ─────────────────────────────────────────────────────────
// CREAR DONANTE
// ─────────────────────────────────────────────────────────
export async function crearDonante(data: any, enfermedadesIds: number[] = []) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado." };

  // Validar si el Documento de Identidad ya existe
  if (data.documentoIdentidad) {
    const existente = await prisma.donante.findUnique({ where: { documentoIdentidad: data.documentoIdentidad } });
    if (existente) return { error: "Ya existe un donante con ese documento de identidad." };
  }

  // Generar código único (ej: DO-2026-94819)
  const anio = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  const codigo = `DO-${anio}-${random}`;

  const donante = await prisma.donante.create({
    data: {
      codigo,
      nombres: data.nombres,
      apellidos: data.apellidos,
      documentoIdentidad: data.documentoIdentidad || null,
      fechaNacimiento: data.fechaNacimiento ? new Date(`${data.fechaNacimiento}T12:00:00Z`) : null,
      sexo: data.sexo,
      ocupacion: data.ocupacion || null,
      centroTrabajo: data.centroTrabajo || null,
      direccion: data.direccion || null,
      municipio: data.municipio || null,
      departamento: data.departamento || null,
      telefono: data.telefono || null,
      email: data.email || null,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
      idTipoDonante: data.idTipoDonante ? parseInt(data.idTipoDonante) : null,
      idGrupoSanguineo: data.idGrupoSanguineo ? parseInt(data.idGrupoSanguineo) : null,
      transfusionesPrevias: data.transfusionesPrevias === "true",
      donacionesPrevias: data.donacionesPrevias === "true",
      // Relacionar enfermedades
      enfermedades: {
        create: enfermedadesIds.map(id => ({
          enfermedad: { connect: { id } },
          fechaDiagnostico: new Date()
        }))
      }
    }
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "donante",
    registroId: donante.id,
    datosNuevos: donante,
  });

  revalidatePath("/donantes");
  return { success: true, id: donante.id };
}

// ─────────────────────────────────────────────────────────
// ACTUALIZAR DONANTE
// ─────────────────────────────────────────────────────────
export async function actualizarDonante(id: number, data: any, enfermedadesIds: number[] = []) {
  const session = await auth();
  if (!session?.user) return { error: "No autorizado." };

  if (data.documentoIdentidad) {
    const existente = await prisma.donante.findFirst({
      where: { documentoIdentidad: data.documentoIdentidad, id: { not: id } }
    });
    if (existente) return { error: "Ya existe otro donante con ese INE/Pasaporte." };
  }

  const anterior = await prisma.donante.findUnique({ where: { id } });
  if (!anterior) return { error: "Donante no encontrado." };

  await prisma.donanteEnfermedad.deleteMany({ where: { idDonante: id } });

  const donanteActualizado = await prisma.donante.update({
    where: { id },
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      documentoIdentidad: data.documentoIdentidad || null,
      fechaNacimiento: data.fechaNacimiento ? new Date(`${data.fechaNacimiento}T12:00:00Z`) : null,
      sexo: data.sexo,
      ocupacion: data.ocupacion || null,
      centroTrabajo: data.centroTrabajo || null,
      direccion: data.direccion || null,
      municipio: data.municipio || null,
      departamento: data.departamento || null,
      telefono: data.telefono || null,
      email: data.email || null,
      temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
      idTipoDonante: data.idTipoDonante ? parseInt(data.idTipoDonante) : null,
      idGrupoSanguineo: data.idGrupoSanguineo ? parseInt(data.idGrupoSanguineo) : null,
      transfusionesPrevias: data.transfusionesPrevias === "true",
      donacionesPrevias: data.donacionesPrevias === "true",
      enfermedades: {
        create: enfermedadesIds.map(eId => ({
          enfermedad: { connect: { id: eId } },
          fechaDiagnostico: new Date()
        }))
      }
    }
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "donante",
    registroId: id,
    datosAnteriores: anterior,
    datosNuevos: donanteActualizado,
  });

  revalidatePath("/donantes");
  revalidatePath(`/donantes/${id}`);
  return { success: true, id };
}

// ─────────────────────────────────────────────────────────
// ELIMINAR DONANTE DEFINITIVAMENTE
// ─────────────────────────────────────────────────────────
export async function eliminarDonanteDefinitivo(id: number) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") {
    return { error: "Solo el administrador puede eliminar registros permanentemente." };
  }

  // Prevenir eliminación si hay donaciones asociadas
  const donaciones = await prisma.donacion.count({ where: { idDonante: id } });
  if (donaciones > 0) {
    return { error: "No se puede eliminar el donante porque tiene unidades de donación registradas en el inventario." };
  }

  const anterior = await prisma.donante.findUnique({ where: { id } });
  if (!anterior) return { error: "Donante no encontrado." };

  await prisma.donanteEnfermedad.deleteMany({ where: { idDonante: id } });
  await prisma.donante.delete({ where: { id } });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "DELETE",
    tablaAfectada: "donante",
    registroId: id,
    datosAnteriores: anterior,
  });

  revalidatePath("/donantes");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// DESACTIVAR/REACTIVAR DONANTE
// ─────────────────────────────────────────────────────────
export async function toggleEstadoDonante(id: number) {
  const session = await auth();
  if (!session?.user || session.user.rol === "consulta") return { error: "No tienes permiso para realizar esta acción." };

  const anterior = await prisma.donante.findUnique({ where: { id } });
  if (!anterior) return { error: "Donante no encontrado." };

  const nuevoEstado = anterior.estado === "activo" ? "inactivo" : "activo";

  const donante = await prisma.donante.update({
    where: { id },
    data: { estado: nuevoEstado }
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "donante",
    registroId: donante.id,
    datosAnteriores: { estado: anterior.estado },
    datosNuevos: { estado: donante.estado },
  });

  revalidatePath("/donantes");
  revalidatePath(`/donantes/${id}`);
  
  return { success: true };
}

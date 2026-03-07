"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { registrarAuditoria } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────
// Helper: verificar que el usuario es administrador
// ─────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.rol !== "administrador") {
    throw new Error("No autorizado: se requiere rol de administrador");
  }
  return session;
}

// ═══════════════════════════════════════════════════════════
//  GRUPOS SANGUÍNEOS
// ═══════════════════════════════════════════════════════════

export async function getGruposSanguineos() {
  return prisma.grupoSanguineo.findMany({
    orderBy: { grupo: "asc" },
    include: {
      _count: { select: { donantes: true, donaciones: true } },
    },
  });
}

export async function crearGrupoSanguineo(data: { grupo: string; descripcion?: string }) {
  const session = await requireAdmin();

  const existente = await prisma.grupoSanguineo.findUnique({ where: { grupo: data.grupo } });
  if (existente) return { error: "Ya existe un grupo sanguíneo con ese nombre." };

  const registro = await prisma.grupoSanguineo.create({
    data: { grupo: data.grupo, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "grupo_sanguineo",
    registroId: registro.id,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function editarGrupoSanguineo(id: number, data: { grupo: string; descripcion?: string }) {
  const session = await requireAdmin();

  const anterior = await prisma.grupoSanguineo.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  const duplicado = await prisma.grupoSanguineo.findFirst({
    where: { grupo: data.grupo, NOT: { id } },
  });
  if (duplicado) return { error: "Ya existe otro grupo sanguíneo con ese nombre." };

  const registro = await prisma.grupoSanguineo.update({
    where: { id },
    data: { grupo: data.grupo, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "grupo_sanguineo",
    registroId: id,
    datosAnteriores: anterior,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function toggleGrupoSanguineo(id: number) {
  const session = await requireAdmin();

  const anterior = await prisma.grupoSanguineo.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  // Si se va a desactivar, verificar que no deja vacío el catálogo
  if (anterior.activo) {
    const activos = await prisma.grupoSanguineo.count({ where: { activo: true } });
    if (activos <= 1) return { error: "No puedes desactivar el último grupo sanguíneo activo." };
  }

  const registro = await prisma.grupoSanguineo.update({
    where: { id },
    data: { activo: !anterior.activo },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "grupo_sanguineo",
    registroId: id,
    datosAnteriores: { activo: anterior.activo },
    datosNuevos: { activo: registro.activo },
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function eliminarGrupoSanguineo(id: number) {
  const session = await requireAdmin();

  // Verificar si está en uso
  const enUsoDonantes = await prisma.donante.count({ where: { idGrupoSanguineo: id } });
  const enUsoDonaciones = await prisma.donacion.count({ where: { idGrupoSanguineo: id } });

  if (enUsoDonantes > 0 || enUsoDonaciones > 0) {
    return { error: "No se puede eliminar porque está asociado a donantes o donaciones. Considere desactivarlo en su lugar." };
  }

  const anterior = await prisma.grupoSanguineo.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  await prisma.grupoSanguineo.delete({ where: { id } });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "DELETE",
    tablaAfectada: "grupo_sanguineo",
    registroId: id,
    datosAnteriores: anterior,
  });

  revalidatePath("/catalogos");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════
//  TIPOS DE DONANTE
// ═══════════════════════════════════════════════════════════

export async function getTiposDonante() {
  return prisma.tipoDonante.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: { select: { donantes: true, donaciones: true } },
    },
  });
}

export async function crearTipoDonante(data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const existente = await prisma.tipoDonante.findUnique({ where: { nombre: data.nombre } });
  if (existente) return { error: "Ya existe un tipo de donante con ese nombre." };

  const registro = await prisma.tipoDonante.create({
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "tipo_donante",
    registroId: registro.id,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function editarTipoDonante(id: number, data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const anterior = await prisma.tipoDonante.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  const duplicado = await prisma.tipoDonante.findFirst({
    where: { nombre: data.nombre, NOT: { id } },
  });
  if (duplicado) return { error: "Ya existe otro tipo de donante con ese nombre." };

  const registro = await prisma.tipoDonante.update({
    where: { id },
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "tipo_donante",
    registroId: id,
    datosAnteriores: anterior,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function toggleTipoDonante(id: number) {
  const session = await requireAdmin();

  const anterior = await prisma.tipoDonante.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  if (anterior.activo) {
    const activos = await prisma.tipoDonante.count({ where: { activo: true } });
    if (activos <= 1) return { error: "No puedes desactivar el último tipo de donante activo." };
  }

  const registro = await prisma.tipoDonante.update({
    where: { id },
    data: { activo: !anterior.activo },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "tipo_donante",
    registroId: id,
    datosAnteriores: { activo: anterior.activo },
    datosNuevos: { activo: registro.activo },
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function eliminarTipoDonante(id: number) {
  const session = await requireAdmin();

  // Verificar si está en uso
  const enUsoDonantes = await prisma.donante.count({ where: { idTipoDonante: id } });
  const enUsoDonaciones = await prisma.donacion.count({ where: { idTipoDonante: id } });

  if (enUsoDonantes > 0 || enUsoDonaciones > 0) {
    return { error: "No se puede eliminar porque está asociado a donantes o donaciones. Considere desactivarlo en su lugar." };
  }

  const anterior = await prisma.tipoDonante.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  await prisma.tipoDonante.delete({ where: { id } });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "DELETE",
    tablaAfectada: "tipo_donante",
    registroId: id,
    datosAnteriores: anterior,
  });

  revalidatePath("/catalogos");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════
//  CLASIFICACIONES DE DONACIÓN
// ═══════════════════════════════════════════════════════════

export async function getClasificaciones() {
  return prisma.clasificacionDonacion.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: { select: { donaciones: true } },
    },
  });
}

export async function crearClasificacion(data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const existente = await prisma.clasificacionDonacion.findUnique({ where: { nombre: data.nombre } });
  if (existente) return { error: "Ya existe una clasificación con ese nombre." };

  const registro = await prisma.clasificacionDonacion.create({
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "clasificacion_donacion",
    registroId: registro.id,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function editarClasificacion(id: number, data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const anterior = await prisma.clasificacionDonacion.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  const duplicado = await prisma.clasificacionDonacion.findFirst({
    where: { nombre: data.nombre, NOT: { id } },
  });
  if (duplicado) return { error: "Ya existe otra clasificación con ese nombre." };

  const registro = await prisma.clasificacionDonacion.update({
    where: { id },
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "clasificacion_donacion",
    registroId: id,
    datosAnteriores: anterior,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function toggleClasificacion(id: number) {
  const session = await requireAdmin();

  const anterior = await prisma.clasificacionDonacion.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  if (anterior.activo) {
    const activos = await prisma.clasificacionDonacion.count({ where: { activo: true } });
    if (activos <= 1) return { error: "No puedes desactivar la última clasificación activa." };
  }

  const registro = await prisma.clasificacionDonacion.update({
    where: { id },
    data: { activo: !anterior.activo },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "clasificacion_donacion",
    registroId: id,
    datosAnteriores: { activo: anterior.activo },
    datosNuevos: { activo: registro.activo },
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function eliminarClasificacion(id: number) {
  const session = await requireAdmin();

  const enUsoDonaciones = await prisma.donacion.count({ where: { idClasificacion: id } });

  if (enUsoDonaciones > 0) {
    return { error: "No se puede eliminar porque está asociada a donaciones. Considere desactivarla." };
  }

  const anterior = await prisma.clasificacionDonacion.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  await prisma.clasificacionDonacion.delete({ where: { id } });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "DELETE",
    tablaAfectada: "clasificacion_donacion",
    registroId: id,
    datosAnteriores: anterior,
  });

  revalidatePath("/catalogos");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════
//  ENFERMEDADES RECIENTES
// ═══════════════════════════════════════════════════════════

export async function getEnfermedades() {
  return prisma.enfermedadReciente.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: { select: { donantes: true } },
    },
  });
}

export async function crearEnfermedad(data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const existente = await prisma.enfermedadReciente.findUnique({ where: { nombre: data.nombre } });
  if (existente) return { error: "Ya existe una enfermedad con ese nombre." };

  const registro = await prisma.enfermedadReciente.create({
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "CREATE",
    tablaAfectada: "enfermedad_reciente",
    registroId: registro.id,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function editarEnfermedad(id: number, data: { nombre: string; descripcion?: string }) {
  const session = await requireAdmin();

  const anterior = await prisma.enfermedadReciente.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  const duplicado = await prisma.enfermedadReciente.findFirst({
    where: { nombre: data.nombre, NOT: { id } },
  });
  if (duplicado) return { error: "Ya existe otra enfermedad con ese nombre." };

  const registro = await prisma.enfermedadReciente.update({
    where: { id },
    data: { nombre: data.nombre, descripcion: data.descripcion || null },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "enfermedad_reciente",
    registroId: id,
    datosAnteriores: anterior,
    datosNuevos: registro,
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function toggleEnfermedad(id: number) {
  const session = await requireAdmin();

  const anterior = await prisma.enfermedadReciente.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  if (anterior.activo) {
    const activos = await prisma.enfermedadReciente.count({ where: { activo: true } });
    if (activos <= 1) return { error: "No puedes desactivar la última enfermedad activa." };
  }

  const registro = await prisma.enfermedadReciente.update({
    where: { id },
    data: { activo: !anterior.activo },
  });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "UPDATE",
    tablaAfectada: "enfermedad_reciente",
    registroId: id,
    datosAnteriores: { activo: anterior.activo },
    datosNuevos: { activo: registro.activo },
  });

  revalidatePath("/catalogos");
  return { success: true, data: registro };
}

export async function eliminarEnfermedad(id: number) {
  const session = await requireAdmin();

  // Check if it is used in donanteEnfermedad association table
  const enUsoRelaciones = await prisma.donanteEnfermedad.count({ where: { idEnfermedad: id } });

  if (enUsoRelaciones > 0) {
    return { error: "No se puede eliminar porque está asignada a uno o más expedientes médicos de donantes. Considere desactivarla." };
  }

  const anterior = await prisma.enfermedadReciente.findUnique({ where: { id } });
  if (!anterior) return { error: "Registro no encontrado." };

  await prisma.enfermedadReciente.delete({ where: { id } });

  await registrarAuditoria({
    idUsuario: Number(session.user.id),
    accion: "DELETE",
    tablaAfectada: "enfermedad_reciente",
    registroId: id,
    datosAnteriores: anterior,
  });

  revalidatePath("/catalogos");
  return { success: true };
}

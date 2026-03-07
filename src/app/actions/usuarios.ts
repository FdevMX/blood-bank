"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────
// LISTAR USUARIOS
// ─────────────────────────────────────────────────────────
export async function getUsuarios() {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return [];

  return await prisma.usuario.findMany({
    orderBy: { fechaCreacion: "desc" },
    select: {
      id: true,
      nombreUsuario: true,
      email: true,
      rol: true,
      estado: true,
      fechaCreacion: true,
      ultimoAcceso: true
    }
  });
}

// ─────────────────────────────────────────────────────────
// CREAR USUARIO (INVITACIÓN)
// ─────────────────────────────────────────────────────────
export async function crearUsuario(data: any) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return { error: "No autorizado." };

  const existe = await prisma.usuario.findUnique({ where: { email: data.email } });
  if (existe) return { error: "Este correo electrónico ya está registrado." };

  try {
    await prisma.usuario.create({
      data: {
        nombreUsuario: data.nombreUsuario,
        email: data.email,
        rol: data.rol,
        estado: "activo",
      }
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al crear el usuario." };
  }
}

// ─────────────────────────────────────────────────────────
// ACTUALIZAR ROL / DATOS DE USUARIO
// ─────────────────────────────────────────────────────────
export async function actualizarUsuario(id: number, data: any) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return { error: "No autorizado." };
  
  // Seguridad: evitar que un admin cambie su propio rol a algo inferior accidentalmente
  if (Number(session.user.id) === id && data.rol !== "administrador") {
      return { error: "No puedes quitarte los permisos de administrador a ti mismo." };
  }

  const u = await prisma.usuario.findUnique({ where: { id } });
  if (!u) return { error: "Usuario no encontrado." };

  try {
    await prisma.usuario.update({
      where: { id },
      data: {
        nombreUsuario: data.nombreUsuario,
        rol: data.rol,
      }
    });

    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al actualizar el usuario." };
  }
}

// ─────────────────────────────────────────────────────────
// DESACTIVAR / ACTIVAR USUARIO
// ─────────────────────────────────────────────────────────
export async function toggleEstadoUsuario(id: number, activar: boolean) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return { error: "No autorizado." };
  if (Number(session.user.id) === id) return { error: "No puedes desactivar tu propia cuenta activa." };

  try {
    await prisma.usuario.update({
      where: { id },
      data: { estado: activar ? "activo" : "inactivo" }
    });
    
    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al cambiar el estado." };
  }
}

// ─────────────────────────────────────────────────────────
// ELIMINAR USUARIO
// ─────────────────────────────────────────────────────────
export async function eliminarUsuario(id: number) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return { error: "No autorizado." };
  if (Number(session.user.id) === id) return { error: "No puedes eliminar tu propia cuenta en sesión." };

  const u = await prisma.usuario.findUnique({ where: { id } });
  if (!u) return { error: "Usuario no encontrado." };

  try {
    // Audit before delete
    await prisma.auditoria.create({
      data: {
        idUsuario: Number(session.user.id),
        accion: "DELETE",
        tablaAfectada: "usuario",
        registroId: id,
        datosAnteriores: u as any,
        fecha: new Date(),
      }
    });

    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "No se puede eliminar el usuario. Probablemente tenga registros de auditoría asociados. Intente desactivarlo." };
  }
}

// ─────────────────────────────────────────────────────────
// OBTENER DETALLE DE USUARIO
// ─────────────────────────────────────────────────────────
export async function getUsuarioDetalle(id: number) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return null;

  return await prisma.usuario.findUnique({
    where: { id },
    include: {
      auditorias: {
        orderBy: { fecha: "desc" },
        take: 20
      }
    }
  });
}

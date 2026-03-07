"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─────────────────────────────────────────────────────────
// OBTENER HISTORIAL DE AUDITORÍA (FILTRABLE)
// ─────────────────────────────────────────────────────────
export async function getAuditoria(busqueda?: string, limit: number = 50) {
  const session = await auth();
  if (session?.user?.rol !== "administrador") return [];

  if (!busqueda || busqueda.trim() === "") {
    return await prisma.auditoria.findMany({
      orderBy: { fecha: "desc" },
      take: limit,
      include: {
        usuario: { select: { nombreUsuario: true, email: true, rol: true } }
      }
    });
  }

  const q = busqueda.trim();
  const qUpper = q.toUpperCase();

  // Determinar si el término coincide con un enum de accion
  const validAcciones = ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW"];
  const esAccion = validAcciones.includes(qUpper);

  const orConditions: any[] = [
    { tablaAfectada: { contains: q, mode: "insensitive" } },
    { ipAddress: { contains: q, mode: "insensitive" } },
    { userAgent: { contains: q, mode: "insensitive" } },
    { usuario: { nombreUsuario: { contains: q, mode: "insensitive" } } },
    { usuario: { email: { contains: q, mode: "insensitive" } } },
  ];

  if (esAccion) {
    orConditions.push({ accion: qUpper as any });
  }

  return await prisma.auditoria.findMany({
    where: { OR: orConditions },
    orderBy: { fecha: "desc" },
    take: limit,
    include: {
      usuario: { select: { nombreUsuario: true, email: true, rol: true } }
    }
  });
}

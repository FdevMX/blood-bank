"use server";

import prisma from "@/lib/prisma";

export type NotificacionTipo = "critico" | "advertencia" | "info";

export interface Notificacion {
  id: string;
  tipo: NotificacionTipo;
  titulo: string;
  descripcion: string;
  href?: string;
}

export async function obtenerNotificaciones(): Promise<Notificacion[]> {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const en7dias = new Date(hoy);
  en7dias.setDate(en7dias.getDate() + 7);

  const hace1año = new Date(hoy);
  hace1año.setFullYear(hace1año.getFullYear() - 1);

  const [
    vencidasCount,
    porVencerCount,
    todosGrupos,
    stockPorGrupo,
    donantesInactivosCount,
  ] = await Promise.all([
    // Donaciones "disponibles" cuya fecha de vencimiento ya pasó (no actualizadas)
    prisma.donacion.count({
      where: {
        estado: "disponible",
        fechaVencimiento: { not: null, lt: hoy },
      },
    }),
    // Donaciones que vencen en los próximos 7 días
    prisma.donacion.count({
      where: {
        estado: "disponible",
        fechaVencimiento: { gte: hoy, lte: en7dias },
      },
    }),
    // Todos los grupos sanguíneos activos
    prisma.grupoSanguineo.findMany({
      where: { activo: true },
      select: { id: true, grupo: true },
      orderBy: { grupo: "asc" },
    }),
    // Conteo de donaciones disponibles por grupo
    prisma.donacion.groupBy({
      by: ["idGrupoSanguineo"],
      where: { estado: "disponible", idGrupoSanguineo: { not: null } },
      _count: { id: true },
    }),
    // Donantes activos que no han donado en más de 1 año
    prisma.donante.count({
      where: {
        estado: "activo",
        fechaUltimaDonacion: { not: null, lt: hace1año },
      },
    }),
  ]);

  const stockMap = new Map(
    stockPorGrupo.map((s) => [s.idGrupoSanguineo!, s._count.id])
  );

  const sinStock = todosGrupos.filter(
    (g) => !stockMap.has(g.id) || stockMap.get(g.id) === 0
  );
  const stockBajo = todosGrupos.filter((g) => {
    const c = stockMap.get(g.id) ?? 0;
    return c > 0 && c <= 3;
  });

  const notifs: Notificacion[] = [];

  if (vencidasCount > 0) {
    const s = vencidasCount !== 1;
    notifs.push({
      id: "vencidas",
      tipo: "critico",
      titulo: `${vencidasCount} donación${s ? "es" : ""} vencida${s ? "s" : ""}`,
      descripcion:
        "Unidades disponibles con fecha de vencimiento expirada que requieren revisión",
      href: "/donaciones",
    });
  }

  if (sinStock.length > 0) {
    const s = sinStock.length !== 1;
    notifs.push({
      id: "sin-stock",
      tipo: "critico",
      titulo: "Sin stock: " + sinStock.map((g) => g.grupo).join(", "),
      descripcion: `${sinStock.length} grupo${s ? "s" : ""} sanguíneo${s ? "s" : ""} sin unidades disponibles`,
      href: "/reportes",
    });
  }

  if (porVencerCount > 0) {
    const s = porVencerCount !== 1;
    notifs.push({
      id: "por-vencer",
      tipo: "advertencia",
      titulo: `${porVencerCount} donación${s ? "es" : ""} por vencer`,
      descripcion: "Vencen en los próximos 7 días — considere usarlas o descartarlas",
      href: "/donaciones",
    });
  }

  if (stockBajo.length > 0) {
    notifs.push({
      id: "stock-bajo",
      tipo: "advertencia",
      titulo: "Stock bajo detectado",
      descripcion:
        "Grupos con ≤3 unidades: " +
        stockBajo
          .map((g) => `${g.grupo} (${stockMap.get(g.id)})`)
          .join(", "),
      href: "/reportes",
    });
  }

  if (donantesInactivosCount > 0) {
    const s = donantesInactivosCount !== 1;
    notifs.push({
      id: "donantes-inactivos",
      tipo: "info",
      titulo: `${donantesInactivosCount} donante${s ? "s" : ""} sin donar hace +1 año`,
      descripcion:
        "Donantes activos con más de un año sin registrar donaciones",
      href: "/donantes",
    });
  }

  return notifs;
}

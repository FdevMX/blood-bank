"use server";

import prisma from "@/lib/prisma";

export interface SearchResult {
  id: string;
  tipo: "donante" | "donacion" | "acceso";
  titulo: string;
  subtitulo: string;
  href: string;
  extra?: string;
}

export async function busquedaGlobal(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();

  const [donantes, donaciones] = await Promise.all([
    prisma.donante.findMany({
      where: {
        OR: [
          { nombres: { contains: q, mode: "insensitive" } },
          { apellidos: { contains: q, mode: "insensitive" } },
          { codigo: { contains: q, mode: "insensitive" } },
          { documentoIdentidad: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        grupoSanguineo: { select: { grupo: true } },
      },
      take: 5,
      orderBy: { fechaRegistro: "desc" },
    }),
    prisma.donacion.findMany({
      where: {
        OR: [
          { codigo: { contains: q, mode: "insensitive" } },
          {
            donante: {
              OR: [
                { nombres: { contains: q, mode: "insensitive" } },
                { apellidos: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: {
        donante: { select: { nombres: true, apellidos: true } },
        grupoSanguineo: { select: { grupo: true } },
      },
      take: 5,
      orderBy: { fecha: "desc" },
    }),
  ]);

  const resultados: SearchResult[] = [];

  donantes.forEach((d) => {
    resultados.push({
      id: `donante-${d.id}`,
      tipo: "donante",
      titulo: `${d.nombres} ${d.apellidos}`,
      subtitulo: `Código: ${d.codigo}${d.documentoIdentidad ? ` · DNI: ${d.documentoIdentidad}` : ""}`,
      href: `/donantes/${d.id}`,
      extra: d.grupoSanguineo?.grupo ?? undefined,
    });
  });

  donaciones.forEach((don) => {
    resultados.push({
      id: `donacion-${don.id}`,
      tipo: "donacion",
      titulo: `Donación ${don.codigo}`,
      subtitulo: `${don.donante.nombres} ${don.donante.apellidos} · ${new Date(don.fecha).toLocaleDateString("es-MX")}`,
      href: `/donaciones/${don.id}`,
      extra: don.grupoSanguineo?.grupo ?? don.estado,
    });
  });

  // Accesos rápidos por palabras clave
  const accesos: Record<string, { titulo: string; subtitulo: string; href: string }> = {
    "donante": { titulo: "Donantes", subtitulo: "Lista de todos los donantes", href: "/donantes" },
    "nuevo donante": { titulo: "Registrar Donante", subtitulo: "Crear nuevo donante", href: "/donantes/nuevo" },
    "donacion": { titulo: "Donaciones", subtitulo: "Lista de todas las donaciones", href: "/donaciones" },
    "nueva donacion": { titulo: "Nueva Donación", subtitulo: "Registrar nueva donación", href: "/donaciones/nueva" },
    "reporte": { titulo: "Reportes", subtitulo: "Ver reportes del sistema", href: "/reportes" },
    "usuario": { titulo: "Usuarios", subtitulo: "Gestión de acceso y operadores", href: "/usuarios" },
    "catalogo": { titulo: "Catálogos", subtitulo: "Grupos sanguíneos, tipos, etc.", href: "/catalogos" },
    "dashboard": { titulo: "Panel de Control", subtitulo: "Ir al dashboard", href: "/dashboard" },
    "auditoria": { titulo: "Auditoría", subtitulo: "Registro de acciones del sistema", href: "/auditoria" },
  };

  const qLower = q.toLowerCase();
  Object.entries(accesos).forEach(([key, value]) => {
    if (key.includes(qLower) || qLower.includes(key)) {
      resultados.push({
        id: `acceso-${key}`,
        tipo: "acceso",
        ...value,
      });
    }
  });

  return resultados;
}

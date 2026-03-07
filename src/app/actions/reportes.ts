"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────
// REPORTE 1: DONANTES POR SEXO
// ─────────────────────────────────────────────────────────
export async function getReporteDonantesPorSexo() {
  const [masculino, femenino, total, inactivos] = await Promise.all([
    prisma.donante.count({ where: { sexo: "MASCULINO" } }),
    prisma.donante.count({ where: { sexo: "FEMENINO" } }),
    prisma.donante.count(),
    prisma.donante.count({ where: { estado: "inactivo" } })
  ]);

  return {
    masculino,
    femenino,
    total,
    inactivos,
    porcentajeMasculino: total > 0 ? Math.round((masculino / total) * 100) : 0,
    porcentajeFemenino: total > 0 ? Math.round((femenino / total) * 100) : 0,
  };
}

// ─────────────────────────────────────────────────────────
// REPORTE 2: INVENTARIO POR GRUPO SANGUÍNEO
// ─────────────────────────────────────────────────────────
export async function getReporteInventarioSanguineo() {
  const grupos = await prisma.grupoSanguineo.findMany({
    include: {
      donaciones: {
        where: { estado: "disponible" },
        select: { cantidadMl: true }
      }
    },
    orderBy: { grupo: "asc" }
  });

  const datosTratados = grupos.map((g: any) => ({
    grupo: g.grupo,
    unidades: g.donaciones.length,
    volumenTotal: g.donaciones.reduce((acc: number, curr: any) => acc + Number(curr.cantidadMl), 0)
  }));

  const totalUnidades = datosTratados.reduce((acc, curr) => acc + curr.unidades, 0);
  const totalVolumen = datosTratados.reduce((acc, curr) => acc + curr.volumenTotal, 0);

  return {
    desglose: datosTratados,
    totalUnidades,
    totalVolumen
  };
}

// ─────────────────────────────────────────────────────────
// REPORTE 3: DONACIONES RECIENTES (ÚLTIMOS 30 DÍAS)
// ─────────────────────────────────────────────────────────
export async function getReporteDonacionesPeriodo() {
  const hace30dias = new Date();
  hace30dias.setDate(hace30dias.getDate() - 30);

  const donaciones = await prisma.donacion.findMany({
    where: { fecha: { gte: hace30dias } },
    orderBy: { fecha: "desc" },
    include: {
      grupoSanguineo: { select: { grupo: true } },
      clasificacion: { select: { nombre: true } }
    }
  });

  type Donacion = typeof donaciones[number];

  const porEstado = {
    disponible: donaciones.filter((d: Donacion) => d.estado === "disponible").length,
    utilizada: donaciones.filter((d: Donacion) => d.estado === "utilizada").length,
    descartada: donaciones.filter((d: Donacion) => d.estado === "descartada").length,
    vencida: donaciones.filter((d: Donacion) => d.estado === "vencida").length,
  };

  return {
    total30Dias: donaciones.length,
    porEstado
  };
}

// ─────────────────────────────────────────────────────────
// REPORTE 4: DONACIONES POR PERIODO DETALLADO
// ─────────────────────────────────────────────────────────
export async function generarReporteDonacionesDetallado(params: {
  fechaInicio?: string;
  fechaFin?: string;
  grupoId?: number;
  clasificacionId?: number;
}) {
  const where: Prisma.DonacionWhereInput = {};

  if (params.fechaInicio || params.fechaFin) {
    where.fecha = {};
    if (params.fechaInicio) {
      where.fecha.gte = new Date(`${params.fechaInicio}T00:00:00Z`);
    }
    if (params.fechaFin) {
      where.fecha.lte = new Date(`${params.fechaFin}T23:59:59Z`);
    }
  }

  if (params.grupoId) {
    where.idGrupoSanguineo = params.grupoId;
  }
  if (params.clasificacionId) {
    where.idClasificacion = params.clasificacionId;
  }

  const donaciones = await prisma.donacion.findMany({
    where,
    orderBy: { fecha: "asc" },
    include: {
      grupoSanguineo: true,
      clasificacion: true,
      donante: {
        select: { nombres: true, apellidos: true, codigo: true, documentoIdentidad: true }
      }
    }
  });

  // Calculate subtotales
  const subtotalesGrupo: Record<string, number> = {};
  const subtotalesClasif: Record<string, number> = {};

  type DonacionDetallada = typeof donaciones[number];
  donaciones.forEach((d: DonacionDetallada) => {
    const g = d.grupoSanguineo?.grupo || "S/R";
    const c = d.clasificacion?.nombre || "Sin Clasificar";
    subtotalesGrupo[g] = (subtotalesGrupo[g] || 0) + 1;
    subtotalesClasif[c] = (subtotalesClasif[c] || 0) + 1;
  });

  return {
    donaciones,
    subtotalesGrupo,
    subtotalesClasif,
    total: donaciones.length,
  };
}

export async function getFiltrosCatalogos() {
  const grupos = await prisma.grupoSanguineo.findMany({
    where: { activo: true },
    select: { id: true, grupo: true },
    orderBy: { grupo: "asc" }
  });
  
  const clasificaciones = await prisma.clasificacionDonacion.findMany({
    where: { activo: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" }
  });

  return { grupos, clasificaciones };
}

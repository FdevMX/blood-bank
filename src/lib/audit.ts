import prisma from "@/lib/prisma";

type AccionAuditoria =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW";

interface AuditoriaOptions {
  idUsuario?: number;
  accion: AccionAuditoria;
  tablaAfectada?: string;
  registroId?: number;
  datosAnteriores?: object;
  datosNuevos?: object;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Registra un evento en la tabla de auditoría.
 * Debe llamarse en todas las Server Actions de escritura.
 */
export async function registrarAuditoria(options: AuditoriaOptions) {
  try {
    await prisma.auditoria.create({
      data: {
        idUsuario: options.idUsuario ?? null,
        accion: options.accion,
        tablaAfectada: options.tablaAfectada ?? null,
        registroId: options.registroId ?? null,
        datosAnteriores: options.datosAnteriores
          ? (options.datosAnteriores as any)
          : undefined,
        datosNuevos: options.datosNuevos
          ? (options.datosNuevos as any)
          : undefined,
        ipAddress: options.ipAddress ?? null,
        userAgent: options.userAgent ?? null,
      },
    });
  } catch (error) {
    // No fallar la operación principal si el registro de auditoría falla
    console.error("[AUDITORIA] Error al registrar evento:", error);
  }
}

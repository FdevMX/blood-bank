/**
 * Script para crear el usuario Administrador inicial.
 * Ejecutar UNA VEZ: npx tsx prisma/create-admin.ts
 *
 * Luego puedes cambiar el email y contraseña directamente en este archivo.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─── CONFIGURA AQUÍ TU ADMIN ──────────────────────────
  const ADMIN_EMAIL = "admin@bancodesangre.com";
  const ADMIN_NOMBRE = "Administrador Principal";
  const ADMIN_PASSWORD = "Admin2026!"; // Cámbialo después del primer login
  // ──────────────────────────────────────────────────────

  console.log("👤 Creando usuario administrador inicial...\n");

  // Verificar si ya existe
  const existente = await prisma.usuario.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existente) {
    console.log(`⚠️  Ya existe un usuario con el email: ${ADMIN_EMAIL}`);
    console.log(`   ID: ${existente.id} | Rol: ${existente.rol}`);
    return;
  }

  // Hash de la contraseña con bcrypt (12 rondas - recomendado OWASP)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.usuario.create({
    data: {
      nombreUsuario: ADMIN_NOMBRE,
      email: ADMIN_EMAIL,
      passwordHash,
      rol: "administrador",
      estado: "activo",
    },
  });

  console.log("✅ Administrador creado exitosamente:");
  console.log(`   ID     : ${admin.id}`);
  console.log(`   Nombre : ${admin.nombreUsuario}`);
  console.log(`   Email  : ${admin.email}`);
  console.log(`   Rol    : ${admin.rol}`);
  console.log(`\n🔐 Credenciales de acceso:`);
  console.log(`   Email      : ${ADMIN_EMAIL}`);
  console.log(`   Contraseña : ${ADMIN_PASSWORD}`);
  console.log(`\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

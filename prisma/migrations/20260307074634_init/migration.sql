-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('administrador', 'operador', 'consulta');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "EstadoDonante" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoDonacion" AS ENUM ('disponible', 'utilizada', 'descartada', 'vencida');

-- CreateEnum
CREATE TYPE "AccionAuditoria" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "rol" "Rol" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'activo',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_sanguineo" (
    "id" SERIAL NOT NULL,
    "grupo" VARCHAR(5) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "grupo_sanguineo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_donante" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipo_donante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clasificacion_donacion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clasificacion_donacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enfermedad_reciente" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "enfermedad_reciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donante" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(25) NOT NULL,
    "nombres" VARCHAR(50) NOT NULL,
    "apellidos" VARCHAR(50) NOT NULL,
    "documento_identidad" VARCHAR(20),
    "fecha_nacimiento" DATE,
    "sexo" "Sexo" NOT NULL,
    "ocupacion" VARCHAR(50),
    "centro_trabajo" VARCHAR(100),
    "direccion" TEXT,
    "municipio" VARCHAR(50),
    "departamento" VARCHAR(50),
    "telefono" VARCHAR(15),
    "email" VARCHAR(150),
    "temperatura" DECIMAL(4,1),
    "id_tipo_donante" INTEGER,
    "id_grupo_sanguineo" INTEGER,
    "fecha_ultima_donacion" DATE,
    "transfusiones_previas" BOOLEAN NOT NULL DEFAULT false,
    "donaciones_previas" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoDonante" NOT NULL DEFAULT 'activo',
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_modificacion" TIMESTAMP(3),

    CONSTRAINT "donante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donacion" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(25) NOT NULL,
    "id_donante" INTEGER NOT NULL,
    "hora" TIME NOT NULL,
    "fecha" DATE NOT NULL,
    "cantidad_ml" DECIMAL(7,2) NOT NULL,
    "id_grupo_sanguineo" INTEGER,
    "id_tipo_donante" INTEGER,
    "id_clasificacion" INTEGER,
    "temperatura" DECIMAL(4,1),
    "peso" DECIMAL(5,2),
    "lso" VARCHAR(20),
    "hemoglobina" DECIMAL(5,2),
    "tension_arterial" VARCHAR(15),
    "observaciones" TEXT,
    "estado" "EstadoDonacion" NOT NULL DEFAULT 'disponible',
    "fecha_vencimiento" DATE,
    "ubicacion" VARCHAR(50),
    "id_usuario_registro" INTEGER,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donante_enfermedad" (
    "id" SERIAL NOT NULL,
    "id_donante" INTEGER NOT NULL,
    "id_enfermedad" INTEGER NOT NULL,
    "fecha_diagnostico" DATE,
    "observaciones" TEXT,

    CONSTRAINT "donante_enfermedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "accion" "AccionAuditoria" NOT NULL,
    "tabla_afectada" VARCHAR(50),
    "registro_id" INTEGER,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_sanguineo_grupo_key" ON "grupo_sanguineo"("grupo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_donante_nombre_key" ON "tipo_donante"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "clasificacion_donacion_nombre_key" ON "clasificacion_donacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "enfermedad_reciente_nombre_key" ON "enfermedad_reciente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "donante_codigo_key" ON "donante"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "donante_documento_identidad_key" ON "donante"("documento_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "donacion_codigo_key" ON "donacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "donante_enfermedad_id_donante_id_enfermedad_key" ON "donante_enfermedad"("id_donante", "id_enfermedad");

-- AddForeignKey
ALTER TABLE "donante" ADD CONSTRAINT "donante_id_tipo_donante_fkey" FOREIGN KEY ("id_tipo_donante") REFERENCES "tipo_donante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donante" ADD CONSTRAINT "donante_id_grupo_sanguineo_fkey" FOREIGN KEY ("id_grupo_sanguineo") REFERENCES "grupo_sanguineo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_id_donante_fkey" FOREIGN KEY ("id_donante") REFERENCES "donante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_id_grupo_sanguineo_fkey" FOREIGN KEY ("id_grupo_sanguineo") REFERENCES "grupo_sanguineo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_id_tipo_donante_fkey" FOREIGN KEY ("id_tipo_donante") REFERENCES "tipo_donante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_id_clasificacion_fkey" FOREIGN KEY ("id_clasificacion") REFERENCES "clasificacion_donacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donacion" ADD CONSTRAINT "donacion_id_usuario_registro_fkey" FOREIGN KEY ("id_usuario_registro") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donante_enfermedad" ADD CONSTRAINT "donante_enfermedad_id_donante_fkey" FOREIGN KEY ("id_donante") REFERENCES "donante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donante_enfermedad" ADD CONSTRAINT "donante_enfermedad_id_enfermedad_fkey" FOREIGN KEY ("id_enfermedad") REFERENCES "enfermedad_reciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

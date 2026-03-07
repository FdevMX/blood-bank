# Stack Tecnológico

Este documento describe las tecnologías seleccionadas para el desarrollo del sistema Banco de Sangre y justifica la elección de cada una.

---

## 1. Visión General del Stack

El sistema utiliza un stack moderno de JavaScript/TypeScript orientado a aplicaciones web full-stack. Toda la lógica — tanto del frontend como del backend — reside en un único proyecto Next.js, lo que simplifica el despliegue y el mantenimiento.

```
Frontend        →  Next.js + React + TypeScript + Tailwind CSS + shadcn
Backend (API)   →  Next.js API Routes / Server Actions
ORM             →  Prisma
Base de Datos   →  PostgreSQL
Autenticación   →  Auth.js (OAuth 2.0)
Despliegue      →  Hosting compatible con Node.js
```

---

## 2. Tecnologías por Capa

### 2.1 Framework Principal: Next.js

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Framework full-stack basado en React |
| **Uso en el proyecto** | Maneja tanto las páginas del frontend como las rutas de API del backend |
| **Por qué se eligió** | Permite construir frontend y backend en un solo proyecto. Soporta Server Components para un rendimiento optimizado. Incluye sistema de rutas estático y dinámico. Bien documentado y con soporte a largo plazo. |
| **Características clave utilizadas** | Server Components, API Routes, Middleware, Server Actions, sistema de routing basado en carpetas |

---

### 2.2 Lenguaje: TypeScript

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Superconjunto tipado de JavaScript |
| **Uso en el proyecto** | Lenguaje principal en todo el código del proyecto |
| **Por qué se eligió** | Detecta errores en tiempo de desarrollo antes de ejecutar el código. Mejora la mantenibilidad y comprensión del código. Obligatorio en proyectos que manejan datos sensibles como lo es este sistema de salud. Integración nativa con Next.js y Prisma. |

---

### 2.3 Estilos: Tailwind CSS

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Framework de CSS utilitario |
| **Uso en el proyecto** | Aplicar estilos a todos los componentes y páginas |
| **Por qué se eligió** | Permite construir interfaces consistentes sin escribir CSS personalizado. Los estilos están co-ubicados con el componente. Genera solo el CSS utilizado, lo que resulta en archivos más pequeños. Integración directa con shadcn. |

---

### 2.4 Componentes UI: shadcn

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Librería de componentes UI para React basada en Radix UI y Tailwind CSS |
| **Uso en el proyecto** | Componentes de interfaz: tablas, formularios, modales, botones, inputs, selects, paginación, toasts de notificación |
| **Por qué se eligió** | Acelera el desarrollo al proveer componentes listos y accesibles. Los componentes se copian al proyecto (no son una dependencia externa opaca), lo que permite modificarlos. Diseño consistente y profesional. Excelente integración con Tailwind CSS y TypeScript. |

---

### 2.5 ORM: Prisma

| Atributo | Detalle |
|----------|---------|
| **Tipo** | ORM (Object-Relational Mapper) para Node.js y TypeScript |
| **Uso en el proyecto** | Todas las interacciones con la base de datos PostgreSQL se realizan a través de Prisma |
| **Por qué se eligió** | Las consultas de Prisma son parametrizadas por diseño, eliminando el riesgo de inyección SQL. El schema define la base de datos como código, versionado en el repositorio. Genera tipos TypeScript automáticos para todos los modelos. Sistema de migraciones integrado. |
| **Características clave utilizadas** | Schema declarativo, migraciones, Prisma Client tipado, seed de datos iniciales |

---

### 2.6 Base de Datos: PostgreSQL

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Sistema de gestión de bases de datos relacional (RDBMS) |
| **Uso en el proyecto** | Almacenamiento persistente de todos los datos del sistema |
| **Por qué se eligió** | Motor robusto y ampliamente utilizado en producción. Soporta integridad referencial con claves foráneas reales. Soporta el tipo JSONB para almacenar snapshots en la tabla de auditoría. Motor por defecto recomendado para proyectos con Prisma. Motor moderno en reemplazo del MyISAM utilizado en el sistema legado. |

---

### 2.7 Autenticación: Auth.js con OAuth 2.0

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Librería de autenticación para Next.js, implementa OAuth 2.0 |
| **Uso en el proyecto** | Gestión completa del flujo de autenticación: login, sesiones, logout |
| **Por qué se eligió** | Implementa el estándar OAuth 2.0 de forma correcta y segura. Se integra nativamente con Next.js. Evita el manejo manual de contraseñas, reduciendo la superficie de ataque. Las sesiones son manejadas de forma segura con tokens firmados. Soporta múltiples proveedores (Google, GitHub, etc.) |
| **Características clave utilizadas** | Proveedor OAuth 2.0 configurado, callbacks para creación de usuario en DB, sesiones con rol del usuario |

---

### 2.8 Validación de Datos: Zod

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Librería de validación y parsing de esquemas para TypeScript |
| **Uso en el proyecto** | Validación de todos los datos recibidos en las API Routes y Server Actions |
| **Por qué se eligió** | Garantiza que los datos que entran al sistema tienen el tipo y formato esperado. Se integra directamente con TypeScript para inferir tipos. Validación tanto en servidor como en cliente. |

---

### 2.9 Generación de PDF

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Librería de generación de documentos PDF para Node.js |
| **Uso en el proyecto** | Exportación de los reportes del sistema en formato PDF |
| **Por qué se eligió** | Permite generar PDFs desde el servidor sin depender del navegador del cliente. Los PDFs se generan de forma consistente independientemente del dispositivo del usuario. |
| **Opción recomendada** | `@react-pdf/renderer` (genera PDFs usando componentes React) |

---

## 3. Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Git** | Control de versiones del código fuente |
| **ESLint** | Análisis estático del código para detectar errores y malas prácticas |
| **Prettier** | Formato automático del código para mantener consistencia |
| **dotenv** | Gestión de variables de entorno (`.env` para local, variables del hosting para producción) |

---

## 4. Entorno de Despliegue

| Componente | Requerimiento |
|------------|---------------|
| **Servidor de aplicación** | Node.js. Compatible con Vercel, Railway, Render u otros hostings que soporten Next.js |
| **Base de datos** | PostgreSQL en la nube. Compatible con Supabase, Railway, Neon u otros proveedores |
| **HTTPS** | Obligatorio en producción. Provisto por el hosting o configurado con certificado SSL |
| **Variables de entorno** | `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, credenciales del proveedor OAuth |

---

## 5. Justificación del Cambio de Stack respecto al Sistema Legado

| Aspecto | Sistema Legado (PHP + MySQL) | Sistema Nuevo (Next.js + PostgreSQL) |
|---------|------------------------------|---------------------------------------|
| Seguridad SQL | Consultas concatenadas (vulnerable a SQLi) | Prisma con consultas parametrizadas por diseño |
| Autenticación | Sin sistema de autenticación | OAuth 2.0 con gestión de sesiones y roles |
| Motor BD | MyISAM (sin FK reales, sin transacciones) | PostgreSQL con integridad referencial completa |
| Tipos de datos | VARCHAR para todo | Tipos nativos (DECIMAL, BOOLEAN, DATE, JSONB) |
| Auditoría | Sin registro de acciones | Tabla de auditoría completa |
| Control de acceso | Sin roles | Sistema de roles: administrador, operador, consulta |
| Validación | Solo en cliente (JavaScript) | Validación en cliente y servidor (Zod) |
| Mantenimiento | HTML y PHP mezclados | Componentes reutilizables y separación de responsabilidades |

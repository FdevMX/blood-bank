# Checklist de Seguridad — OWASP Top 10

Este documento mapea cada uno de los 10 riesgos de seguridad más críticos de OWASP al sistema Banco de Sangre, describiendo el riesgo específico en este contexto y las medidas de mitigación que deben implementarse y verificarse antes del despliegue.

La seguridad es el requisito principal de este proyecto. Todos los puntos marcados como **OBLIGATORIO** deben estar implementados antes de cualquier despliegue a producción.

---

## A01: Pérdida de Control de Acceso

**Riesgo en este sistema:** Un usuario con rol Operador o Consulta podría intentar acceder a funciones del Administrador (gestión de usuarios, log de auditoría, cambio de estado de donaciones) navegando directamente a las URLs o llamando directamente a los endpoints de la API.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-01 | El middleware de Next.js debe verificar la sesión en TODAS las rutas del sistema excepto `/login` | OBLIGATORIO | Intentar acceder a `/dashboard` sin sesión: debe redirigir a `/login` |
| SEC-02 | Cada Server Action y API Route debe verificar el rol del usuario antes de ejecutar la operación, independientemente del middleware de ruta | OBLIGATORIO | Llamar directamente a una Server Action de Admin con un token de sesión de Operador: debe devolver error 403 |
| SEC-03 | Las páginas del Administrador (`/admin/*`, `/catalogos/*`) deben verificar rol `administrador` tanto en la carga de la página como en cada acción | OBLIGATORIO | Acceder a `/admin/usuarios` con sesión de Operador: debe mostrar 403 |
| SEC-04 | Los donantes inactivos no deben poder tener nuevas donaciones registradas | OBLIGATORIO | Intentar registrar donación a donante inactivo: debe rechazarse en servidor |
| SEC-05 | Los registros de auditoría no deben poder ser modificados ni eliminados por ningún rol | OBLIGATORIO | Verificar que no existe ningún endpoint para UPDATE o DELETE en la tabla auditoria |

---

## A02: Fallas Criptográficas

**Riesgo en este sistema:** Exposición de datos sensibles como datos médicos de donantes, documentos de identidad o credenciales de autenticación.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-06 | Toda comunicación debe realizarse sobre HTTPS en producción. HTTP debe redirigir automáticamente a HTTPS | OBLIGATORIO | Acceder al dominio con HTTP: debe redirigir a HTTPS |
| SEC-07 | Si se almacenan contraseñas locales, deben estar hasheadas con bcrypt (factor de costo mínimo 12) | OBLIGATORIO | Verificar en base de datos que no existen contraseñas en texto plano |
| SEC-08 | Las variables de entorno con secretos (`NEXTAUTH_SECRET`, `DATABASE_URL`, credenciales OAuth) nunca deben estar en el código fuente ni en el repositorio Git | OBLIGATORIO | Revisar el historial de Git: no deben existir archivos `.env` con secretos reales |
| SEC-09 | El `NEXTAUTH_SECRET` debe ser una cadena aleatoria de al menos 32 caracteres | OBLIGATORIO | Verificar que el secreto no es predecible ni débil |
| SEC-10 | Los datos médicos sensibles (documento de identidad, enfermedades) no deben aparecer en URLs ni en logs del servidor | RECOMENDADO | Revisar que los parámetros sensibles viajan en el cuerpo de la solicitud, no en la URL |

---

## A03: Inyección

**Riesgo en este sistema:** El sistema legado tenía consultas SQL concatenadas directamente con datos del usuario, lo que permitía inyección SQL. Este es el riesgo más crítico del sistema anterior.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-11 | Todas las consultas a la base de datos deben realizarse exclusivamente a través de Prisma. No se deben construir consultas SQL en modo raw con datos del usuario | OBLIGATORIO | Revisar que no existe ningún `prisma.$queryRawUnsafe()` ni concatenación de strings en consultas |
| SEC-12 | Todos los datos del usuario deben validarse con Zod antes de pasar al ORM | OBLIGATORIO | Enviar valores fuera del esquema esperado: deben rechazarse antes de llegar a Prisma |
| SEC-13 | Las salidas de datos deben sanitizarse al renderizarse en HTML para prevenir XSS almacenado | OBLIGATORIO | Guardar un string con `<script>alert(1)</script>` como nombre de donante y verificar que se renderiza como texto, no se ejecuta |
| SEC-14 | No se deben ejecutar comandos del sistema operativo con datos del usuario | OBLIGATORIO | No se utiliza `exec()`, `shell_exec()` ni equivalentes en el proyecto |

---

## A04: Diseño Inseguro

**Riesgo en este sistema:** Falta de reglas de negocio que prevengan registros inválidos (donaciones sin donante, usuarios sin rol, datos médicos sin validar).

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-15 | No debe ser posible registrar una donación sin un ID de donante válido y activo | OBLIGATORIO | Intentar enviar formulario de donación con ID de donante inválido: debe rechazarse |
| SEC-16 | No debe ser posible crear un usuario sin un rol asignado | OBLIGATORIO | Verificar que el campo `rol` es obligatorio y del conjunto de valores permitidos |
| SEC-17 | La tabla `auditoria` debe diseñarse como append-only desde el inicio | OBLIGATORIO | Verificar que el schema de Prisma no expone métodos de update o delete para auditoria |
| SEC-18 | Los estados de donación deben seguir las transiciones permitidas (disponible → utilizada/descartada/vencida) | OBLIGATORIO | Intentar cambiar estado de `utilizada` a `disponible`: debe rechazarse |

---

## A05: Configuración de Seguridad Incorrecta

**Riesgo en este sistema:** Exposición de información de depuración en producción, headers HTTP inseguros, o configuraciones por defecto no modificadas.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-19 | La variable de entorno `NODE_ENV` debe ser `production` en el entorno de producción para deshabilitar mensajes de error detallados | OBLIGATORIO | Verificar la variable de entorno en el servidor de producción |
| SEC-20 | Los headers de seguridad HTTP deben estar configurados en `next.config.js`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` | OBLIGATORIO | Verificar headers con herramienta como [securityheaders.com](https://securityheaders.com) |
| SEC-21 | Las páginas de error no deben exponer stack traces, rutas internas ni mensajes técnicos al usuario final | OBLIGATORIO | Provocar un error en producción: el mensaje mostrado al usuario debe ser genérico |
| SEC-22 | El archivo `.env` con secretos reales nunca debe subirse al repositorio | OBLIGATORIO | Verificar `.gitignore` incluye `.env` |
| SEC-23 | Las rutas de API que no se usen no deben existir en producción | RECOMENDADO | Revisar que no hay endpoints innecesarios expuestos |

---

## A06: Componentes Vulnerables y Desactualizados

**Riesgo en este sistema:** Dependencias de npm con vulnerabilidades conocidas.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-24 | Ejecutar `npm audit` antes del despliegue y corregir vulnerabilidades críticas y altas | OBLIGATORIO | Verificar que no hay vulnerabilidades críticas pendientes al hacer deploy |
| SEC-25 | Mantener las dependencias actualizadas durante el desarrollo | RECOMENDADO | Revisar periódicamente con `npm outdated` |

---

## A07: Fallas de Identificación y Autenticación

**Riesgo en este sistema:** Un usuario desactivado que sigue teniendo acceso, sesiones que no expiran, o un atacante que accede con una sesión robada.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-26 | Un usuario con estado `inactivo` en la base de datos no debe poder iniciar sesión, aunque el proveedor OAuth lo autentique correctamente | OBLIGATORIO | Desactivar un usuario en DB e intentar hacer login con sus credenciales OAuth: debe rechazarse con mensaje de cuenta inactiva |
| SEC-27 | Las sesiones deben expirar automáticamente tras un período de inactividad | OBLIGATORIO | Configurar expiración de sesión en Auth.js y verificar que el usuario es redirigido a login al expirar |
| SEC-28 | El cierre de sesión debe invalidar el token en el servidor | OBLIGATORIO | Hacer logout y luego intentar usar el token anterior: debe devolver error de sesión inválida |
| SEC-29 | El callback de OAuth debe verificar que el email del usuario existe en la tabla `usuario` antes de crear la sesión | OBLIGATORIO | Intentar hacer login con un email OAuth que no esté registrado en la tabla usuario: debe rechazarse |

---

## A08: Fallas en la Integridad del Software y los Datos

**Riesgo en este sistema:** Datos manipulados en tránsito o en la base de datos sin dejar rastro.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-30 | Los datos enviados desde el cliente no deben ser confiables sin validación en servidor | OBLIGATORIO | Modificar el payload de un formulario antes de enviarlo: el servidor debe rechazar datos fuera del esquema |
| SEC-31 | El sistema de auditoría debe registrar el estado anterior y posterior de cada modificación | OBLIGATORIO | Editar un donante y verificar que el evento de auditoría tiene los datos correctos en `datos_anteriores` y `datos_nuevos` |

---

## A09: Fallas en el Registro y Monitoreo de Seguridad

**Riesgo en este sistema:** Accesos no autorizados o modificaciones sobre datos médicos sensibles sin dejar rastro.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-32 | Los eventos de login exitoso y fallido deben registrarse en la tabla `auditoria` | OBLIGATORIO | Verificar que hay registros de LOGIN en la tabla auditoria tras iniciar sesión |
| SEC-33 | Todo CREATE, UPDATE y DELETE sobre `donante`, `donacion`, `usuario` y catálogos debe generar un evento de auditoría | OBLIGATORIO | Crear un donante y verificar que existe el evento correspondiente en auditoria |
| SEC-34 | El log de auditoría debe incluir la dirección IP del cliente en cada evento | OBLIGATORIO | Verificar que el campo `ip_address` no es NULL en los eventos registrados |
| SEC-35 | El Administrador debe poder filtrar y consultar el log de auditoría desde la interfaz | OBLIGATORIO | Acceder a `/admin/auditoria` con rol administrador y verificar que se muestran los eventos |

---

## A10: Falsificación de Solicitudes del Lado del Servidor (SSRF)

**Riesgo en este sistema:** Bajo en este proyecto ya que no se realizan solicitudes a URLs externas basadas en datos del usuario. El riesgo principal está en el proveedor OAuth.

| ID | Medida | Prioridad | Verificación |
|----|--------|-----------|--------------|
| SEC-36 | La URL de callback del proveedor OAuth debe estar restringida únicamente al dominio de la aplicación en la configuración del proveedor | OBLIGATORIO | Verificar en el panel del proveedor OAuth que solo el dominio de producción está en la lista blanca de URLs de callback |
| SEC-37 | No se debe aceptar ninguna URL proporcionada por el usuario para realizar solicitudes del servidor | OBLIGATORIO | Verificar que no existe ningún endpoint que acepte una URL como parámetro y realice una solicitud a ella |

---

## Resumen de Verificaciones por Fase

| Fase | Verificaciones a realizar |
|------|---------------------------|
| Fase 2 (Autenticación) | SEC-01, SEC-06, SEC-07, SEC-08, SEC-09, SEC-19, SEC-22, SEC-26, SEC-27, SEC-28, SEC-29, SEC-36 |
| Fase 4 (Donantes) | SEC-02, SEC-03, SEC-11, SEC-12, SEC-13, SEC-15, SEC-33, SEC-34 |
| Fase 5 (Donaciones) | SEC-04, SEC-15, SEC-16, SEC-18, SEC-31 |
| Fase 7 (Revisión Final) | TODOS los puntos de este checklist |
| Fase 8 (Despliegue) | SEC-06, SEC-19, SEC-20, SEC-21, SEC-24, SEC-37 |

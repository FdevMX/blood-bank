# Fases de Desarrollo

El desarrollo está organizado en 8 fases secuenciales. Cada fase construye sobre la anterior. Las fases deben completarse en el orden establecido ya que hay dependencias entre ellas.

---

## Resumen de Fases

| Fase | Nombre | Módulos que cubre | Prerequisito |
|------|--------|-------------------|--------------|
| 1 | Configuración del Proyecto y Base de Datos | Infraestructura | Ninguno |
| 2 | Autenticación y Gestión de Usuarios | Módulo 1 y 7 | Fase 1 |
| 3 | Mantenimiento de Catálogos | Módulo 6 | Fase 2 |
| 4 | Gestión de Donantes | Módulo 2 | Fase 3 |
| 5 | Gestión de Donaciones | Módulo 3 | Fase 4 |
| 6 | Búsquedas y Reportes | Módulos 4 y 5 | Fase 5 |
| 7 | Auditoría y Revisión de Seguridad | Transversal | Fase 6 |
| 8 | Despliegue a Producción | Infraestructura | Fase 7 |

---

## Fase 1: Configuración del Proyecto y Base de Datos

### Objetivo
Establecer la base técnica del proyecto: estructura de carpetas, configuración de herramientas y creación completa de la base de datos.

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F1-T01 | Inicializar el proyecto | Crear el proyecto con Next.js y TypeScript. Configurar el archivo de variables de entorno. |
| F1-T02 | Configurar Tailwind CSS | Instalar y configurar Tailwind CSS en el proyecto. |
| F1-T03 | Configurar shadcn | Instalar y configurar el paquete de componentes shadcn. Definir el tema visual base (colores, tipografía). |
| F1-T04 | Configurar Prisma | Instalar Prisma, conectarlo a la base de datos PostgreSQL y verificar la conexión. |
| F1-T05 | Definir el schema de Prisma | Escribir el schema completo con todas las tablas, campos, tipos, restricciones y relaciones definidas en la documentación de base de datos. |
| F1-T06 | Ejecutar migraciones iniciales | Aplicar el schema a la base de datos PostgreSQL mediante la primera migración. |
| F1-T07 | Poblar datos iniciales (seed) | Insertar los datos iniciales de los catálogos: grupos sanguíneos (8), tipos de donante (6), clasificaciones de donación (2), enfermedades recientes (16). |
| F1-T08 | Crear estructura de carpetas | Organizar el proyecto según la estructura definida en `3_tecnico/03_estructura_proyecto.md`. |

### Entregable
Proyecto inicializado, base de datos creada con todas las tablas y datos de catálogos cargados. La conexión entre la aplicación y la base de datos debe funcionar correctamente.

---

## Fase 2: Autenticación y Gestión de Usuarios

### Objetivo
Implementar el sistema de autenticación OAuth 2.0 y el módulo de administración de usuarios. Todo el acceso al sistema queda protegido desde esta fase.

### Dependencia
Requiere que la Fase 1 esté completada (base de datos disponible).

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F2-T01 | Configurar Auth.js con OAuth 2.0 | Instalar Auth.js y conectar con el proveedor OAuth 2.0. Configurar el callback para crear o verificar el usuario en la tabla `usuario` de la base de datos. |
| F2-T02 | Implementar middleware de protección | Crear el middleware que verifica sesión activa en todas las rutas del sistema excepto la de login. |
| F2-T03 | Implementar control de roles | Crear la función que verifica el rol del usuario antes de ejecutar cualquier acción protegida. |
| F2-T04 | Crear página de login | Página de acceso al sistema con botón de autenticación OAuth 2.0. |
| F2-T05 | Crear layout principal | Layout con barra de navegación, información del usuario autenticado y botón de cierre de sesión. El menú muestra solo las opciones accesibles según el rol. |
| F2-T06 | Crear módulo de usuarios (Admin) | CRUD de usuarios del sistema: listado, creación, edición y desactivación. Solo accesible para Administrador. |
| F2-T07 | Implementar registro de auditoría | Crear la función centralizada que registra eventos en la tabla `auditoria`. Esta función será reutilizada en todos los módulos posteriores. |
| F2-T08 | Registrar eventos de autenticación | Conectar el registro de auditoría a los eventos de login y logout. |

### Entregable
Sistema de login funcional con OAuth 2.0. Todas las rutas protegidas. Módulo de usuarios operativo para el Administrador. Función de auditoría disponible para los demás módulos.

---

## Fase 3: Mantenimiento de Catálogos

### Objetivo
Crear las pantallas de administración de los 4 catálogos maestros. Esta fase debe completarse antes de los módulos de donantes y donaciones ya que sus formularios dependen de los catálogos.

### Dependencia
Requiere que la Fase 2 esté completada (autenticación y roles funcionando).

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F3-T01 | CRUD de enfermedades recientes | Listado, creación, edición y desactivación de enfermedades del catálogo. |
| F3-T02 | CRUD de tipos de donante | Listado, creación, edición y desactivación de tipos de donante. |
| F3-T03 | CRUD de clasificaciones de donación | Listado, creación, edición y desactivación de clasificaciones. |
| F3-T04 | CRUD de grupos sanguíneos | Listado, creación, edición y desactivación de grupos sanguíneos. |
| F3-T05 | Verificar restricciones de integridad | Asegurarse de que no se puedan desactivar catálogos que dejarían sin opciones a los formularios. Mostrar un aviso antes de desactivar si el elemento está en uso. |

### Entregable
Los 4 catálogos son configurables desde la interfaz por el Administrador. Los datos de seed están disponibles y visibles.

---

## Fase 4: Gestión de Donantes

### Objetivo
Implementar el módulo completo de gestión de donantes: registro, edición, listado, búsqueda y consulta de detalle con historial.

### Dependencia
Requiere que la Fase 3 esté completada (catálogos disponibles para los formularios).

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F4-T01 | Página de listado de donantes | Tabla paginada con filtros de búsqueda básicos. |
| F4-T02 | Formulario de registro de donante | Formulario completo con todos los campos. Incluye el selector múltiple de enfermedades recientes del catálogo. Validaciones en cliente y servidor. |
| F4-T03 | Formulario de edición de donante | Carga datos existentes y permite modificarlos. |
| F4-T04 | Página de detalle del donante | Vista de solo lectura con todos los datos. Muestra enfermedades asociadas e historial de donaciones (vacío hasta completar Fase 5). |
| F4-T05 | Indicador de elegibilidad | Calcular y mostrar si el donante es elegible para donar según las reglas médicas RN-01 a RN-04. |
| F4-T06 | Desactivación de donante | Botón de desactivación con confirmación. Solo visible para Admin y Operador. |
| F4-T07 | Buscador de donantes | Implementar búsqueda por nombre, código, documento y grupo sanguíneo. |
| F4-T08 | Registrar acciones en auditoría | Todo CREATE y UPDATE de donante debe generar un evento en la tabla `auditoria`. |

### Entregable
Módulo de donantes completamente funcional. Se pueden crear, editar, buscar y consultar donantes. El historial de donaciones se mostrará vacío hasta completar la Fase 5.

---

## Fase 5: Gestión de Donaciones

### Objetivo
Implementar el módulo de registro y gestión de donaciones, incluyendo la verificación de elegibilidad del donante y el control de estado de cada unidad de sangre.

### Dependencia
Requiere que la Fase 4 esté completada (donantes registrados para poder vincular donaciones).

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F5-T01 | Página de listado de donaciones | Tabla paginada con filtros por fecha, grupo sanguíneo, tipo, clasificación y estado. |
| F5-T02 | Formulario de registro de donación | Buscador de donante, verificación de elegibilidad (sin mostrar formulario si no es elegible), formulario de parámetros médicos. |
| F5-T03 | Verificación de elegibilidad | Implementar las reglas RN-01 a RN-04 en el flujo de registro. Mostrar advertencias médicas para las reglas RN-05 a RN-10 sin bloquear. |
| F5-T04 | Actualización de fecha de última donación | Al guardar una donación, actualizar automáticamente el campo `fecha_ultima_donacion` del donante correspondiente. |
| F5-T05 | Página de detalle de donación | Vista completa de los datos de la donación con enlace al perfil del donante. |
| F5-T06 | Cambio de estado (solo Admin) | Flujo para cambiar el estado de una donación con confirmación. Registrar en auditoría. |
| F5-T07 | Historial en perfil de donante | Conectar el historial de donaciones en la página de detalle del donante (F4-T04). |
| F5-T08 | Registrar acciones en auditoría | Todo CREATE y UPDATE de donación debe generar un evento en auditoría. |

### Entregable
Módulo de donaciones completamente funcional. Las donaciones se registran vinculadas a donantes. El historial aparece en el perfil del donante. El estado de las donaciones puede administrarse.

---

## Fase 6: Búsquedas y Reportes

### Objetivo
Implementar las búsquedas avanzadas con filtros combinados y los tres reportes exportables en PDF.

### Dependencia
Requiere que las Fases 4 y 5 estén completadas (datos de donantes y donaciones disponibles).

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F6-T01 | Búsqueda avanzada de donantes | Formulario con todos los filtros disponibles del módulo de búsqueda M4-F01. |
| F6-T02 | Búsqueda avanzada de donaciones | Formulario con todos los filtros disponibles del módulo de búsqueda M4-F02. |
| F6-T03 | Reporte de donantes por sexo | Implementar el reporte M5-R01 con vista previa y exportación PDF. |
| F6-T04 | Reporte de donaciones por período | Implementar el reporte M5-R02 con vista previa y exportación PDF. |
| F6-T05 | Reporte de inventario por grupo sanguíneo | Implementar el reporte M5-R03 con vista previa y exportación PDF. |

### Entregable
Búsquedas avanzadas operativas. Los tres reportes funcionan con filtros y exportan correctamente a PDF.

---

## Fase 7: Auditoría Completa y Revisión de Seguridad

### Objetivo
Completar el módulo de auditoría visible para el Administrador y realizar una revisión completa de seguridad del sistema antes del despliegue.

### Dependencia
Requiere que todas las fases anteriores estén completadas.

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F7-T01 | Página de log de auditoría (Admin) | Tabla paginada con todos los eventos registrados. Filtros por usuario, acción, tabla y rango de fechas. |
| F7-T02 | Revisión de protección de rutas | Verificar que todos los endpoints de la API y todas las páginas apliquen el control de roles correctamente. |
| F7-T03 | Verificar validaciones | Confirmar que todas las entradas están validadas en el servidor, no solo en el cliente. |
| F7-T04 | Revisión del checklist OWASP | Recorrer todos los puntos del checklist en `4_seguridad/01_checklist_owasp.md` y verificar su cumplimiento. |
| F7-T05 | Pruebas de acceso no autorizado | Intentar acceder a funciones de Admin con rol Operador y Consulta. Verificar que el sistema bloquea correctamente. |
| F7-T06 | Verificar headers de seguridad | Confirmar que la aplicación incluye los headers HTTP de seguridad necesarios. |

### Entregable
Log de auditoría visible para el Administrador. Todos los puntos críticos del checklist de seguridad verificados y corregidos.

---

## Fase 8: Despliegue a Producción

### Objetivo
Configurar y desplegar la aplicación en el hosting de producción con base de datos PostgreSQL en la nube.

### Dependencia
Requiere que la Fase 7 esté completada y el checklist de seguridad aprobado.

### Tareas

| ID | Tarea | Descripción |
|----|-------|-------------|
| F8-T01 | Configurar base de datos en producción | Crear la base de datos PostgreSQL en el entorno de producción y ejecutar las migraciones. |
| F8-T02 | Configurar variables de entorno | Definir todas las variables de entorno de producción (cadena de conexión, secretos de OAuth, claves de sesión). |
| F8-T03 | Configurar proveedor OAuth para producción | Registrar la URL de producción en el proveedor OAuth 2.0 como URL de callback autorizada. |
| F8-T04 | Desplegar aplicación | Subir la aplicación al servidor de hosting. Verificar que el build de producción funciona correctamente. |
| F8-T05 | Ejecutar seed en producción | Cargar los datos iniciales de catálogos en la base de datos de producción. |
| F8-T06 | Crear usuario Administrador inicial | Crear el primer usuario con rol Administrador en la base de datos de producción. |
| F8-T07 | Verificar HTTPS | Confirmar que la aplicación corre bajo HTTPS y que HTTP redirige a HTTPS. |
| F8-T08 | Pruebas en producción | Verificar que todos los módulos funcionan correctamente en el entorno de producción. |

### Entregable
Aplicación desplegada, accesible desde internet bajo HTTPS, con usuario Administrador inicial configurado y todos los módulos operativos.

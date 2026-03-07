# Módulos del Sistema

El sistema está compuesto por 7 módulos. Cada módulo agrupa funcionalidades relacionadas y tiene un conjunto de roles que pueden acceder a él.

---

## Módulo 1: Autenticación y Control de Acceso

### Descripción
Gestiona el proceso de ingreso y salida del sistema, asegura que solo usuarios autorizados accedan, y controla qué puede hacer cada usuario según su rol.

### Funcionalidades

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M1-F01 | Pantalla de login | Página de acceso con botón de autenticación OAuth 2.0. No hay formulario de usuario/contraseña propio. |
| M1-F02 | Autenticación OAuth 2.0 | Redirige al proveedor OAuth configurado para autenticar al usuario. Al regresar, el sistema verifica que el usuario exista y esté activo. |
| M1-F03 | Gestión de sesión | Crea y mantiene la sesión del usuario autenticado. La sesión contiene el ID de usuario, nombre, email y rol. |
| M1-F04 | Expiración de sesión | Las sesiones expiran automáticamente tras un período de inactividad configurable. |
| M1-F05 | Protección de rutas | Todas las páginas del sistema verifican que haya sesión activa antes de cargar. Si no hay sesión, redirige a la página de login. |
| M1-F06 | Control por rol | Cada página y acción verifica que el rol del usuario tenga permiso para realizarla. Si no tiene permiso, muestra un error 403. |
| M1-F07 | Cierre de sesión | Invalida la sesión en el servidor y redirige al usuario a la pantalla de login. |
| M1-F08 | Registro en auditoría | Todo evento de login exitoso, login fallido y logout se registra con fecha, hora e IP de origen. |

### Roles con acceso
- Todos los roles (autenticación es prerequisito para el sistema).

---

## Módulo 2: Gestión de Donantes

### Descripción
Administra el ciclo de vida completo de los registros de donantes. Incluye registro, edición, consulta, historial y desactivación.

### Funcionalidades

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M2-F01 | Listado de donantes | Tabla paginada con todos los donantes activos e inactivos. Muestra: código, nombre completo, sexo, grupo sanguíneo, estado y fecha de última donación. Permite ordenar por columna. |
| M2-F02 | Registro de nuevo donante | Formulario completo con todos los campos personales y médicos. Incluye selección múltiple de enfermedades recientes desde catálogo. Validación completa en cliente y servidor. Los campos requeridos están marcados visualmente. |
| M2-F03 | Edición de donante | Carga el formulario con los datos actuales del donante. Las validaciones son idénticas al registro. Registra el cambio en auditoría indicando qué campos fueron modificados. |
| M2-F04 | Ver detalle de donante | Vista de solo lectura con todos los datos del donante. Muestra las enfermedades asociadas. Muestra el historial de donaciones del donante en una tabla. Muestra si el donante es elegible para donar actualmente. |
| M2-F05 | Indicador de elegibilidad | En la vista de detalle, el sistema calcula y muestra si el donante puede donar en la fecha actual según las reglas médicas. Si no es elegible, indica la razón y la fecha aproximada en que podría donar. |
| M2-F06 | Desactivación de donante | Cambia el estado del donante a "inactivo". El registro y su historial se conservan. Los donantes inactivos no pueden tener nuevas donaciones registradas. |
| M2-F07 | Búsqueda de donantes | Buscador en tiempo real por: código, nombre, apellido, número de documento de identidad o grupo sanguíneo. |

### Entradas del módulo
- Datos personales: código, nombres, apellidos, documento de identidad, fecha de nacimiento, sexo.
- Datos de contacto: dirección, municipio, departamento, teléfono, email.
- Datos laborales: ocupación, centro de trabajo.
- Datos médicos: temperatura, tipo de donante, grupo sanguíneo, fecha de última donación.
- Historial médico: transfusiones previas (sí/no), donaciones previas (sí/no), enfermedades recientes (selección múltiple del catálogo).

### Salidas del módulo
- Registro creado o actualizado en la tabla `donante`.
- Registros creados o eliminados en la tabla `donante_enfermedad`.
- Evento registrado en la tabla `auditoria`.
- Confirmación visual al usuario con el resultado de la operación.

### Roles con acceso
| Rol | Crear | Editar | Consultar | Desactivar |
|-----|-------|--------|-----------|------------|
| Administrador | ✓ | ✓ | ✓ | ✓ |
| Operador | ✓ | ✓ | ✓ | ✓ |
| Consulta | ✗ | ✗ | ✓ | ✗ |

---

## Módulo 3: Gestión de Donaciones

### Descripción
Registra y administra cada evento de donación de sangre. Cada donación es vinculada a un donante existente y contiene todos los parámetros médicos tomados al momento de la donación.

### Funcionalidades

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M3-F01 | Listado de donaciones | Tabla paginada con todas las donaciones. Muestra: código, nombre del donante, fecha, grupo sanguíneo, tipo, clasificación y estado actual. |
| M3-F02 | Registro de donación | Selección del donante mediante buscador. El sistema verifica la elegibilidad del donante antes de permitir continuar. Si es elegible, muestra el formulario completo de donación. |
| M3-F03 | Verificación de elegibilidad al registrar | Antes de mostrar el formulario de donación, el sistema valida si el donante cumple las reglas médicas (tiempo entre donaciones, estado activo). Si no es elegible, muestra el motivo y bloquea el formulario. |
| M3-F04 | Ver detalle de donación | Vista de solo lectura con todos los datos y parámetros médicos de la donación. Incluye un enlace al perfil del donante. |
| M3-F05 | Cambio de estado de donación | Permite actualizar el estado de una donación: disponible → utilizada, descartada o vencida. Solo accesible para Administrador. Cada cambio queda registrado en auditoría. |
| M3-F06 | Búsqueda de donaciones | Filtros por: código de donación, nombre del donante, grupo sanguíneo, tipo de donante, clasificación, estado y rango de fechas. |

### Entradas del módulo
- Selección del donante (vinculado desde la tabla `donante`).
- Fecha y hora de la donación.
- Cantidad de sangre donada (en mililitros).
- Grupo sanguíneo de la donación.
- Tipo de donante.
- Clasificación de la donación (ÚTIL / NO ÚTIL).
- Parámetros médicos: temperatura, peso, LSO (leucocitos), hemoglobina, tensión arterial.
- Ubicación física de almacenamiento.
- Fecha de vencimiento de la unidad de sangre.
- Observaciones opcionales.

### Salidas del módulo
- Registro creado en la tabla `donacion`.
- Actualización del campo `fecha_ultima_donacion` en la tabla `donante`.
- Evento registrado en la tabla `auditoria`.
- Confirmación visual al usuario.

### Roles con acceso
| Rol | Crear | Ver detalle | Cambiar estado | Buscar |
|-----|-------|-------------|----------------|--------|
| Administrador | ✓ | ✓ | ✓ | ✓ |
| Operador | ✓ | ✓ | ✗ | ✓ |
| Consulta | ✗ | ✓ | ✗ | ✓ |

---

## Módulo 4: Búsquedas y Consultas

### Descripción
Proporciona herramientas de búsqueda y filtrado avanzado para localizar donantes y donaciones usando múltiples criterios combinados.

### Funcionalidades

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M4-F01 | Búsqueda de donantes | Filtros: nombre, apellido, código, documento de identidad, grupo sanguíneo, sexo, municipio, estado (activo/inactivo). |
| M4-F02 | Búsqueda de donaciones | Filtros: código, nombre del donante, grupo sanguíneo, tipo de donante, clasificación, estado, rango de fechas de donación. |
| M4-F03 | Filtros combinados | El usuario puede combinar múltiples filtros en una sola búsqueda. |
| M4-F04 | Resultados paginados | Todos los resultados se muestran en tablas con paginación. El usuario puede configurar cuántos registros ver por página. |
| M4-F05 | Ordenamiento de resultados | Las columnas de la tabla de resultados permiten ordenar ascendente o descendente. |

### Roles con acceso
- Todos los roles autenticados tienen acceso completo a búsquedas y consultas.

---

## Módulo 5: Reportes

### Descripción
Genera reportes estadísticos y operativos a partir de los datos registrados. Todos los reportes pueden exportarse en PDF.

### Reportes disponibles

| ID | Reporte | Descripción | Filtros disponibles |
|----|---------|-------------|---------------------|
| M5-R01 | Donantes por sexo | Listado y conteo de donantes agrupado por sexo. Muestra totales y porcentajes. | Período de registro, estado del donante |
| M5-R02 | Donaciones por período | Listado de todas las donaciones en un rango de fechas. Muestra subtotales por clasificación y grupo sanguíneo. | Rango de fechas, grupo sanguíneo, clasificación |
| M5-R03 | Inventario por grupo sanguíneo | Resumen de unidades de sangre en estado "disponible" agrupadas por grupo sanguíneo. Muestra cantidad total y volumen en mililitros. | Estado de la donación, grupo sanguíneo |

### Funcionalidades comunes a todos los reportes
- Formulario de filtros antes de generar el reporte.
- Vista previa del reporte en pantalla antes de exportar.
- Botón para exportar el reporte en formato PDF.
- El PDF incluye fecha de generación, nombre del reporte y los filtros aplicados.

### Roles con acceso
- Todos los roles autenticados pueden generar todos los reportes.

---

## Módulo 6: Mantenimiento de Catálogos

### Descripción
Permite al Administrador gestionar los datos de los catálogos maestros del sistema. Los catálogos son los datos de referencia utilizados en los formularios de donantes y donaciones.

### Catálogos del sistema

| Catálogo | Tabla | Uso |
|----------|-------|-----|
| Enfermedades Recientes | `enfermedad_reciente` | Selección múltiple en registro de donante |
| Tipos de Donante | `tipo_donante` | Selección en registro de donante y donación |
| Clasificaciones de Donación | `clasificacion_donacion` | Selección en registro de donación (ÚTIL / NO ÚTIL) |
| Grupos Sanguíneos | `grupo_sanguineo` | Selección en registro de donante y donación |

### Funcionalidades por catálogo

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M6-F01 | Listado de registros | Tabla con todos los registros del catálogo, mostrando nombre, descripción y estado (activo/inactivo). |
| M6-F02 | Crear registro | Formulario para agregar un nuevo elemento al catálogo. No se permiten nombres duplicados. |
| M6-F03 | Editar registro | Modificar el nombre o descripción de un elemento existente del catálogo. |
| M6-F04 | Desactivar registro | Cambiar el estado a "inactivo". Los registros inactivos no aparecen en los formularios, pero los registros históricos que los usan no se ven afectados. No se elimina el registro físicamente. |

### Roles con acceso
- Solo Administrador.

---

## Módulo 7: Gestión de Usuarios

### Descripción
Permite al Administrador administrar las cuentas de los usuarios del sistema y visualizar el log completo de auditoría.

### Funcionalidades

| ID | Funcionalidad | Descripción |
|----|---------------|-------------|
| M7-F01 | Listado de usuarios | Tabla con todos los usuarios del sistema. Muestra nombre, email, rol, estado y fecha de último acceso. |
| M7-F02 | Creación de usuario | Formulario para registrar un nuevo usuario con nombre, email y rol asignado. El usuario deberá autenticarse por primera vez mediante OAuth 2.0. |
| M7-F03 | Edición de usuario | Modificación de nombre, email o rol de un usuario existente. |
| M7-F04 | Desactivación de usuario | Bloqueo de acceso del usuario al sistema. El usuario no puede iniciar sesión. Su historial de auditoría se conserva. |
| M7-F05 | Log de auditoría | Tabla con todos los eventos registrados. Muestra: usuario, acción, tabla afectada, registro afectado, IP, fecha y hora. Filtrable por usuario, acción, tabla y rango de fechas. |

### Roles con acceso
- Solo Administrador.

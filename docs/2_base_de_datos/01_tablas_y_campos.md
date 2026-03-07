# Tablas y Campos de la Base de Datos

Base de datos: **bancodesangredb** | Motor: **PostgreSQL** | Codificación: **UTF-8**
NOTA: Debe adaptarse para su uso y manejo desde supabase.

El sistema utiliza **9 tablas**. Las tablas de catálogo (`grupo_sanguineo`, `tipo_donante`, `clasificacion_donacion`, `enfermedad_reciente`) son datos de referencia configurables. Las tablas operacionales (`donante`, `donacion`, `donante_enfermedad`) almacenan los datos del negocio. Las tablas de sistema (`usuario`, `auditoria`) soportan la seguridad y trazabilidad.

---

## Tabla 1: `usuario`

Almacena las cuentas de acceso al sistema. La autenticación se realiza mediante OAuth 2.0; esta tabla complementa los datos del usuario con su rol y estado dentro del sistema.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `nombre_usuario` | VARCHAR(100) | No | No | — | Nombre completo del usuario |
| `email` | VARCHAR(150) | No | Sí | — | Email del usuario, enlazado con el proveedor OAuth |
| `password_hash` | VARCHAR(255) | Sí | No | NULL | Hash bcrypt de la contraseña. NULL si usa solo OAuth |
| `rol` | VARCHAR(20) | No | No | — | Rol asignado: `administrador`, `operador`, `consulta` |
| `estado` | VARCHAR(20) | No | No | `activo` | Estado de la cuenta: `activo`, `inactivo` |
| `fecha_creacion` | TIMESTAMP | No | No | NOW() | Fecha y hora en que se creó la cuenta |
| `ultimo_acceso` | TIMESTAMP | Sí | No | NULL | Fecha y hora del último inicio de sesión exitoso |

**Clave primaria:** `id`  
**Índices adicionales:** `email` (único)  
**Restricción:** `rol` debe ser uno de: `administrador`, `operador`, `consulta`  
**Restricción:** `estado` debe ser uno de: `activo`, `inactivo`

---

## Tabla 2: `grupo_sanguineo`

Catálogo de los 8 grupos sanguíneos del sistema ABO con factor Rh. Configurable por el Administrador.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `grupo` | VARCHAR(5) | No | Sí | — | Nombre del grupo sanguíneo: A+, A-, B+, B-, AB+, AB-, O+, O- |
| `descripcion` | TEXT | Sí | No | NULL | Descripción adicional del grupo sanguíneo |
| `activo` | BOOLEAN | No | No | TRUE | Indica si el grupo está disponible en los formularios |

**Clave primaria:** `id`  
**Índices adicionales:** `grupo` (único)  
**Datos iniciales:** 8 registros (A+, A-, B+, B-, AB+, AB-, O+, O-)

---

## Tabla 3: `tipo_donante`

Catálogo de los tipos de donación que puede realizar un donante. Configurable por el Administrador.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `nombre` | VARCHAR(50) | No | Sí | — | Nombre del tipo: VOLUNTARIO, FAMILIAR, PLASMAFERESIS, TROMBOCITIFERESIS, LEUCOCITOSFERESIS, OTROS |
| `descripcion` | TEXT | Sí | No | NULL | Descripción del tipo de donante |
| `activo` | BOOLEAN | No | No | TRUE | Indica si el tipo está disponible en los formularios |

**Clave primaria:** `id`  
**Índices adicionales:** `nombre` (único)  
**Datos iniciales:** 6 registros

---

## Tabla 4: `clasificacion_donacion`

Catálogo que indica si una donación es aprovechable. Configurable por el Administrador.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `nombre` | VARCHAR(50) | No | Sí | — | Clasificación: UTIL, NO UTIL |
| `descripcion` | TEXT | Sí | No | NULL | Descripción de la clasificación |
| `activo` | BOOLEAN | No | No | TRUE | Indica si la clasificación está disponible en los formularios |

**Clave primaria:** `id`  
**Índices adicionales:** `nombre` (único)  
**Datos iniciales:** 2 registros (UTIL, NO UTIL)

---

## Tabla 5: `enfermedad_reciente`

Catálogo de enfermedades recientes que pueden asociarse a un donante. Configurable por el Administrador.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `nombre` | VARCHAR(100) | No | Sí | — | Nombre de la enfermedad o condición |
| `descripcion` | TEXT | Sí | No | NULL | Descripción o notas médicas sobre la enfermedad |
| `activo` | BOOLEAN | No | No | TRUE | Indica si la enfermedad está disponible en los formularios |

**Clave primaria:** `id`  
**Índices adicionales:** `nombre` (único)  
**Datos iniciales:** 16 registros (Hepatitis, Sífilis, Paludismo, Brucelosis, Tuberculosis, Febriles, Diabetes, Mellitus, Cardiovasculares, Convulsiones, Pérdida Reciente de Peso, Extracciones Dentales, Sueros o Vacunaciones, Afecciones de la Piel, Ingesta de Medicamentos, Cirugía Mayor)

---

## Tabla 6: `donante`

Almacena el registro completo de cada donante con sus datos personales, de contacto y médicos.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `codigo` | VARCHAR(25) | No | Sí | — | Código único asignado al donante |
| `nombres` | VARCHAR(50) | No | No | — | Nombres del donante |
| `apellidos` | VARCHAR(50) | No | No | — | Apellidos del donante |
| `documento_identidad` | VARCHAR(20) | Sí | Sí | NULL | Número de documento de identidad (único si se proporciona) |
| `fecha_nacimiento` | DATE | Sí | No | NULL | Fecha de nacimiento para cálculo de edad |
| `sexo` | VARCHAR(20) | No | No | — | Sexo del donante: `MASCULINO`, `FEMENINO` |
| `ocupacion` | VARCHAR(50) | Sí | No | NULL | Profesión u ocupación |
| `centro_trabajo` | VARCHAR(100) | Sí | No | NULL | Nombre del lugar de trabajo |
| `direccion` | TEXT | Sí | No | NULL | Dirección de residencia completa |
| `municipio` | VARCHAR(50) | Sí | No | NULL | Municipio de residencia |
| `departamento` | VARCHAR(50) | Sí | No | NULL | Departamento o provincia de residencia |
| `telefono` | VARCHAR(15) | Sí | No | NULL | Número de teléfono de contacto |
| `email` | VARCHAR(150) | Sí | No | NULL | Correo electrónico del donante |
| `temperatura` | DECIMAL(4,1) | Sí | No | NULL | Temperatura corporal al momento del registro (°C) |
| `id_tipo_donante` | INTEGER | Sí | No | NULL | FK → `tipo_donante.id` |
| `id_grupo_sanguineo` | INTEGER | Sí | No | NULL | FK → `grupo_sanguineo.id` |
| `fecha_ultima_donacion` | DATE | Sí | No | NULL | Fecha de la donación más reciente (actualizado automáticamente) |
| `transfusiones_previas` | BOOLEAN | No | No | FALSE | Indica si ha recibido transfusiones de sangre anteriormente |
| `donaciones_previas` | BOOLEAN | No | No | FALSE | Indica si ha donado sangre anteriormente |
| `estado` | VARCHAR(20) | No | No | `activo` | Estado del registro: `activo`, `inactivo` |
| `fecha_registro` | TIMESTAMP | No | No | NOW() | Fecha y hora en que se creó el registro |
| `ultima_modificacion` | TIMESTAMP | Sí | No | NULL | Fecha y hora de la última actualización del registro |

**Clave primaria:** `id`  
**Índices adicionales:** `codigo` (único), `documento_identidad` (único, cuando no es NULL)  
**Clave foránea:** `id_tipo_donante` → `tipo_donante.id`  
**Clave foránea:** `id_grupo_sanguineo` → `grupo_sanguineo.id`  
**Restricción:** `sexo` debe ser `MASCULINO` o `FEMENINO`  
**Restricción:** `estado` debe ser `activo` o `inactivo`

---

## Tabla 7: `donacion`

Registra cada evento de donación de sangre. Cada donación está vinculada a exactamente un donante y contiene todos los parámetros médicos tomados en el momento.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `codigo` | VARCHAR(25) | No | Sí | — | Código único de la donación (asignado por el operador) |
| `id_donante` | INTEGER | No | No | — | FK → `donante.id`. Donante que realizó la donación |
| `hora` | TIME | No | No | — | Hora en que se realizó la donación |
| `fecha` | DATE | No | No | — | Fecha en que se realizó la donación |
| `cantidad_ml` | DECIMAL(7,2) | No | No | — | Cantidad de sangre donada en mililitros |
| `id_grupo_sanguineo` | INTEGER | Sí | No | NULL | FK → `grupo_sanguineo.id`. Grupo sanguíneo de la unidad donada |
| `id_tipo_donante` | INTEGER | Sí | No | NULL | FK → `tipo_donante.id`. Tipo de donación realizada |
| `id_clasificacion` | INTEGER | Sí | No | NULL | FK → `clasificacion_donacion.id`. Clasificación ÚTIL o NO ÚTIL |
| `temperatura` | DECIMAL(4,1) | Sí | No | NULL | Temperatura del donante al momento de donar (°C) |
| `peso` | DECIMAL(5,2) | Sí | No | NULL | Peso del donante al momento de donar (kg) |
| `lso` | VARCHAR(20) | Sí | No | NULL | Valor de Leucocitos Serie Oscura del donante |
| `hemoglobina` | DECIMAL(5,2) | Sí | No | NULL | Nivel de hemoglobina del donante (g/dL) |
| `tension_arterial` | VARCHAR(15) | Sí | No | NULL | Tensión arterial en formato sistólica/diastólica (ej: 120/80) |
| `observaciones` | TEXT | Sí | No | NULL | Notas adicionales del operador médico |
| `estado` | VARCHAR(20) | No | No | `disponible` | Estado de la unidad: `disponible`, `utilizada`, `descartada`, `vencida` |
| `fecha_vencimiento` | DATE | Sí | No | NULL | Fecha de vencimiento de la unidad de sangre |
| `ubicacion` | VARCHAR(50) | Sí | No | NULL | Ubicación física de almacenamiento (ej: Refrigerador A - Estante 2) |
| `id_usuario_registro` | INTEGER | Sí | No | NULL | FK → `usuario.id`. Usuario que registró la donación |
| `fecha_registro` | TIMESTAMP | No | No | NOW() | Fecha y hora en que se creó el registro en el sistema |

**Clave primaria:** `id`  
**Índices adicionales:** `codigo` (único), `id_donante`, `fecha`, `estado`  
**Clave foránea:** `id_donante` → `donante.id`  
**Clave foránea:** `id_grupo_sanguineo` → `grupo_sanguineo.id`  
**Clave foránea:** `id_tipo_donante` → `tipo_donante.id`  
**Clave foránea:** `id_clasificacion` → `clasificacion_donacion.id`  
**Clave foránea:** `id_usuario_registro` → `usuario.id`  
**Restricción:** `estado` debe ser uno de: `disponible`, `utilizada`, `descartada`, `vencida`

---

## Tabla 8: `donante_enfermedad`

Tabla de relación muchos-a-muchos entre donantes y enfermedades recientes. Un donante puede tener varias enfermedades y una enfermedad puede estar asociada a varios donantes.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `id_donante` | INTEGER | No | No | — | FK → `donante.id`. Donante al que pertenece la asociación |
| `id_enfermedad` | INTEGER | No | No | — | FK → `enfermedad_reciente.id`. Enfermedad asociada al donante |
| `fecha_diagnostico` | DATE | Sí | No | NULL | Fecha aproximada del diagnóstico de la enfermedad |
| `observaciones` | TEXT | Sí | No | NULL | Notas médicas adicionales sobre la enfermedad en este donante |

**Clave primaria:** `id`  
**Índice único compuesto:** `(id_donante, id_enfermedad)` — Un donante no puede tener la misma enfermedad registrada dos veces  
**Clave foránea:** `id_donante` → `donante.id` (ON DELETE CASCADE)  
**Clave foránea:** `id_enfermedad` → `enfermedad_reciente.id`

---

## Tabla 9: `auditoria`

Registra todas las acciones sensibles realizadas en el sistema. Su propósito es la trazabilidad completa y la detección de accesos no autorizados.

| Campo | Tipo | Nulo | Único | Valor por Defecto | Descripción |
|-------|------|------|-------|-------------------|-------------|
| `id` | SERIAL | No | Sí (PK) | Auto | Identificador único autoincremental |
| `id_usuario` | INTEGER | Sí | No | NULL | FK → `usuario.id`. Usuario que realizó la acción (NULL si es sistema) |
| `accion` | VARCHAR(50) | No | No | — | Tipo de acción: `LOGIN`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`, `VIEW` |
| `tabla_afectada` | VARCHAR(50) | Sí | No | NULL | Nombre de la tabla sobre la que se realizó la acción |
| `registro_id` | INTEGER | Sí | No | NULL | ID del registro afectado dentro de la tabla |
| `datos_anteriores` | JSONB | Sí | No | NULL | Snapshot de los datos del registro antes de ser modificado |
| `datos_nuevos` | JSONB | Sí | No | NULL | Snapshot de los datos del registro después de ser modificado |
| `ip_address` | VARCHAR(45) | Sí | No | NULL | Dirección IP del cliente que originó la acción (soporta IPv6) |
| `user_agent` | TEXT | Sí | No | NULL | Información del navegador y sistema operativo del cliente |
| `fecha` | TIMESTAMP | No | No | NOW() | Fecha y hora exacta en que ocurrió el evento |

**Clave primaria:** `id`  
**Índices adicionales:** `id_usuario`, `accion`, `tabla_afectada`, `fecha`  
**Clave foránea:** `id_usuario` → `usuario.id` (SET NULL si el usuario es eliminado físicamente — aunque la política del sistema es no eliminar usuarios)  
**Nota:** Esta tabla es de solo inserción. Ningún registro de auditoría puede ser editado ni eliminado por ningún rol.

---

## Resumen de Tablas

| # | Tabla | Tipo | Registros iniciales |
|---|-------|------|---------------------|
| 1 | `usuario` | Sistema | 1 (administrador inicial) |
| 2 | `grupo_sanguineo` | Catálogo | 8 |
| 3 | `tipo_donante` | Catálogo | 6 |
| 4 | `clasificacion_donacion` | Catálogo | 2 |
| 5 | `enfermedad_reciente` | Catálogo | 16 |
| 6 | `donante` | Operacional | 0 (se llena en uso) |
| 7 | `donacion` | Operacional | 0 (se llena en uso) |
| 8 | `donante_enfermedad` | Relación | 0 (se llena en uso) |
| 9 | `auditoria` | Sistema | 0 (se llena automáticamente) |

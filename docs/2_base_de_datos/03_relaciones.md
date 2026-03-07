# Relaciones entre Tablas

Este documento describe en detalle todas las relaciones entre las tablas de la base de datos, el tipo de relación, la cardinalidad, las restricciones de integridad referencial y el comportamiento esperado al modificar registros relacionados.

---

## 1. Resumen General de Relaciones

| Tabla Padre | Tabla Hija | Tipo | Campo de unión | Cardinalidad |
|-------------|------------|------|----------------|--------------|
| `tipo_donante` | `donante` | Catálogo → Operacional | `donante.id_tipo_donante` | 1 tipo : N donantes |
| `grupo_sanguineo` | `donante` | Catálogo → Operacional | `donante.id_grupo_sanguineo` | 1 grupo : N donantes |
| `tipo_donante` | `donacion` | Catálogo → Operacional | `donacion.id_tipo_donante` | 1 tipo : N donaciones |
| `grupo_sanguineo` | `donacion` | Catálogo → Operacional | `donacion.id_grupo_sanguineo` | 1 grupo : N donaciones |
| `clasificacion_donacion` | `donacion` | Catálogo → Operacional | `donacion.id_clasificacion` | 1 clasificación : N donaciones |
| `usuario` | `donacion` | Sistema → Operacional | `donacion.id_usuario_registro` | 1 usuario : N donaciones |
| `donante` | `donacion` | Operacional → Operacional | `donacion.id_donante` | 1 donante : N donaciones |
| `donante` | `donante_enfermedad` | Operacional → Relación | `donante_enfermedad.id_donante` | 1 donante : N asociaciones |
| `enfermedad_reciente` | `donante_enfermedad` | Catálogo → Relación | `donante_enfermedad.id_enfermedad` | 1 enfermedad : N asociaciones |
| `usuario` | `auditoria` | Sistema → Sistema | `auditoria.id_usuario` | 1 usuario : N eventos |

---

## 2. Relaciones Detalladas

### Relación 1: `tipo_donante` → `donante`

- **Descripción:** Clasifica a cada donante según el tipo de donación que realiza de forma predominante.
- **Tipo:** Muchos a uno (N:1). Muchos donantes pueden tener el mismo tipo.
- **Restricción:** El campo `id_tipo_donante` en `donante` es opcional (puede ser NULL si no se ha asignado tipo al registrar).
- **Al desactivar un tipo:** El tipo pasa a `activo = false`. Los donantes existentes con ese tipo conservan el valor. El tipo no aparece en nuevos formularios.
- **Al intentar eliminar un tipo que está en uso:** El sistema debe prevenir la eliminación física si hay donantes o donaciones que lo referencian.

---

### Relación 2: `grupo_sanguineo` → `donante`

- **Descripción:** Indica el grupo sanguíneo del donante.
- **Tipo:** Muchos a uno (N:1). Muchos donantes pueden tener el mismo grupo sanguíneo.
- **Restricción:** El campo `id_grupo_sanguineo` en `donante` es opcional (puede ser NULL).
- **Al desactivar un grupo:** Los registros históricos conservan el valor. El grupo no aparece en nuevos formularios.

---

### Relación 3: `donante` → `donacion`

- **Descripción:** Vincula cada donación con el donante que la realizó. Es la relación central del sistema.
- **Tipo:** Uno a muchos (1:N). Un donante puede tener registradas múltiples donaciones.
- **Restricción:** El campo `id_donante` en `donacion` es **obligatorio** (NOT NULL). No puede existir una donación sin un donante asociado.
- **Comportamiento en cascada:** Si un donante es desactivado (no eliminado físicamente), sus donaciones no se ven afectadas y siguen siendo accesibles.
- **Actualización automática:** Al crear una nueva donación, el sistema actualiza el campo `fecha_ultima_donacion` en la tabla `donante` con la fecha de esa donación.

---

### Relación 4: `tipo_donante` → `donacion`

- **Descripción:** Especifica el tipo de donación realizada en cada evento de donación.
- **Tipo:** Muchos a uno (N:1).
- **Restricción:** Opcional (puede ser NULL).
- **Nota:** Un donante puede tener un tipo asignado en su perfil, pero al registrar una donación puede especificarse un tipo distinto.

---

### Relación 5: `grupo_sanguineo` → `donacion`

- **Descripción:** Indica el grupo sanguíneo de la unidad de sangre de esa donación específica.
- **Tipo:** Muchos a uno (N:1).
- **Restricción:** Opcional (puede ser NULL).
- **Nota:** Generalmente coincide con el grupo sanguíneo del donante, pero se registra por separado en la donación para garantizar trazabilidad de la unidad.

---

### Relación 6: `clasificacion_donacion` → `donacion`

- **Descripción:** Clasifica la donación como ÚTIL o NO ÚTIL según la evaluación médica.
- **Tipo:** Muchos a uno (N:1).
- **Restricción:** Opcional (puede ser NULL si no se ha clasificado aún).

---

### Relación 7: `usuario` → `donacion`

- **Descripción:** Registra qué usuario del sistema ingresó la donación.
- **Tipo:** Muchos a uno (N:1). Un usuario puede haber registrado muchas donaciones.
- **Restricción:** Opcional (puede ser NULL).
- **Propósito:** Auditoría interna de qué operador ingresó cada registro.

---

### Relación 8: `donante` → `donante_enfermedad` ← `enfermedad_reciente`

- **Descripción:** Relación muchos-a-muchos entre donantes y enfermedades recientes, implementada mediante la tabla de unión `donante_enfermedad`.
- **Tipo:** Muchos a muchos (N:M). Un donante puede tener varias enfermedades. Una enfermedad puede estar asociada a varios donantes.
- **Restricción de unicidad:** La combinación `(id_donante, id_enfermedad)` es única. No se puede asociar la misma enfermedad al mismo donante dos veces.
- **Comportamiento en cascada:** Si un donante es eliminado físicamente (lo cual no ocurre en la política normal del sistema), sus asociaciones en `donante_enfermedad` se eliminan en cascada (`ON DELETE CASCADE`).
- **Al desactivar una enfermedad del catálogo:** Las asociaciones históricas se conservan. La enfermedad no aparece en nuevos formularios.

---

### Relación 9: `usuario` → `auditoria`

- **Descripción:** Cada evento de auditoría registra el usuario que lo originó.
- **Tipo:** Muchos a uno (N:1). Un usuario puede haber generado muchos eventos de auditoría.
- **Restricción:** Opcional (puede ser NULL para eventos de sistema que no tienen un usuario asociado).
- **Comportamiento especial:** Los registros de auditoría nunca se modifican ni eliminan. Son de solo inserción.

---

## 3. Restricciones de Integridad Referencial

| Relación | ON DELETE | ON UPDATE | Justificación |
|----------|-----------|-----------|---------------|
| `donante.id_tipo_donante` → `tipo_donante.id` | RESTRICT | CASCADE | No permitir eliminar tipos en uso |
| `donante.id_grupo_sanguineo` → `grupo_sanguineo.id` | RESTRICT | CASCADE | No permitir eliminar grupos en uso |
| `donacion.id_donante` → `donante.id` | RESTRICT | CASCADE | No permitir eliminar donantes con donaciones |
| `donacion.id_tipo_donante` → `tipo_donante.id` | RESTRICT | CASCADE | No permitir eliminar tipos en uso |
| `donacion.id_grupo_sanguineo` → `grupo_sanguineo.id` | RESTRICT | CASCADE | No permitir eliminar grupos en uso |
| `donacion.id_clasificacion` → `clasificacion_donacion.id` | RESTRICT | CASCADE | No permitir eliminar clasificaciones en uso |
| `donacion.id_usuario_registro` → `usuario.id` | SET NULL | CASCADE | Conservar donación aunque el usuario sea eliminado |
| `donante_enfermedad.id_donante` → `donante.id` | CASCADE | CASCADE | Eliminar asociaciones si el donante es eliminado |
| `donante_enfermedad.id_enfermedad` → `enfermedad_reciente.id` | RESTRICT | CASCADE | No permitir eliminar enfermedades en uso |
| `auditoria.id_usuario` → `usuario.id` | SET NULL | CASCADE | Conservar auditoría aunque el usuario sea eliminado |

> **Nota importante:** La política del sistema es no realizar eliminaciones físicas de ningún registro (donantes, usuarios, catálogos). Por lo tanto, las restricciones RESTRICT son una salvaguarda adicional, no el flujo normal de operación.

---

## 4. Índices Recomendados para Rendimiento

Además de los índices de clave primaria y foránea, se recomiendan los siguientes índices para optimizar las búsquedas más frecuentes:

| Tabla | Campo(s) | Tipo | Justificación |
|-------|----------|------|---------------|
| `donante` | `estado` | Simple | Filtrar donantes activos/inactivos |
| `donante` | `nombres, apellidos` | Compuesto | Búsqueda por nombre |
| `donante` | `id_grupo_sanguineo` | Simple | Filtrar por grupo sanguíneo |
| `donacion` | `fecha` | Simple | Filtrar por fecha o rango de fechas |
| `donacion` | `estado` | Simple | Filtrar por estado de la donación |
| `donacion` | `id_donante` | Simple | Obtener donaciones de un donante |
| `auditoria` | `fecha` | Simple | Filtrar eventos por fecha |
| `auditoria` | `id_usuario` | Simple | Filtrar eventos por usuario |
| `auditoria` | `tabla_afectada` | Simple | Filtrar eventos por tabla |

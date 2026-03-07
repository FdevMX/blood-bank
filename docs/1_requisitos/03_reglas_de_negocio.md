# Reglas de Negocio y Lógica del Dominio

Este documento define las reglas que gobiernan los datos del sistema. Estas reglas provienen del dominio médico de los bancos de sangre y deben ser aplicadas por el sistema de forma automática.

---

## 1. Reglas de Elegibilidad para Donación

Antes de registrar una nueva donación, el sistema debe verificar que el donante cumpla todas las condiciones siguientes. Si alguna condición no se cumple, el sistema debe indicar cuál es la razón y bloquear el registro de la donación.

| ID | Regla | Condición | Acción si no se cumple |
|----|-------|-----------|------------------------|
| RN-01 | Tiempo mínimo entre donaciones | Deben haber transcurrido al menos **90 días** desde la fecha de la última donación registrada | No permitir la donación. Mostrar fecha a partir de la cual puede donar nuevamente. |
| RN-02 | Donante debe estar activo | El donante debe tener estado "activo" en el sistema | No permitir la donación. Mostrar que el donante está inactivo. |
| RN-03 | Edad mínima | El donante debe tener al menos **18 años** de edad | No permitir la donación. Informar que no cumple la edad mínima. |
| RN-04 | Edad máxima | El donante no debe superar los **65 años** de edad | No permitir la donación. Informar que supera la edad máxima permitida. |

---

## 2. Reglas de Validación de Parámetros Médicos

Al registrar una donación, los parámetros médicos del donante son capturados en el momento. El sistema debe validar que los valores estén dentro de rangos aceptables. Valores fuera de rango no bloquean el registro pero deben mostrar una advertencia visual.

| ID | Parámetro | Rango Aceptable | Unidad | Observación |
|----|-----------|-----------------|--------|-------------|
| RN-05 | Temperatura corporal | 36.0 — 37.5 | °C | Fuera de rango: advertencia. |
| RN-06 | Peso del donante | 50 o más | kg | Por debajo de 50 kg: advertencia. |
| RN-07 | Hemoglobina (Hb) — Mujeres | 12.5 o más | g/dL | Por debajo: advertencia. |
| RN-08 | Hemoglobina (Hb) — Hombres | 13.0 o más | g/dL | Por debajo: advertencia. |
| RN-09 | Tensión arterial sistólica | 110 — 160 | mmHg | Fuera de rango: advertencia. |
| RN-10 | Tensión arterial diastólica | 60 — 100 | mmHg | Fuera de rango: advertencia. |

---

## 3. Reglas de Clasificación de la Donación

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-11 | Clasificación ÚTIL | Una donación se clasifica como ÚTIL cuando los parámetros médicos están dentro de los rangos aceptables y el donante cumple todos los criterios de elegibilidad. |
| RN-12 | Clasificación NO ÚTIL | Una donación se clasifica como NO ÚTIL cuando algún parámetro médico está fuera de rango o el donante presenta condiciones que afectan la calidad de la sangre. |
| RN-13 | La clasificación es manual | La clasificación ÚTIL / NO ÚTIL la asigna el operador o médico al momento del registro, el sistema no la asigna automáticamente. El sistema solo muestra advertencias. |

---

## 4. Reglas de Estado de Donación

Una vez registrada, una donación pasa por los siguientes estados. Solo el Administrador puede cambiar el estado de una donación.

| Estado | Descripción | Transiciones permitidas |
|--------|-------------|-------------------------|
| `disponible` | La unidad de sangre está almacenada y lista para uso. | → `utilizada`, → `descartada`, → `vencida` |
| `utilizada` | La unidad de sangre fue utilizada en un paciente. | No se puede cambiar (estado final). |
| `descartada` | La unidad fue descartada por no cumplir estándares. | No se puede cambiar (estado final). |
| `vencida` | La unidad superó su fecha de vencimiento sin ser utilizada. | No se puede cambiar (estado final). |

---

## 5. Reglas de Enfermedades Recientes

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-14 | Un donante puede tener cero o más enfermedades recientes registradas | Las enfermedades son informativas para el personal médico |
| RN-15 | Las enfermedades se seleccionan del catálogo | No se pueden ingresar enfermedades que no estén en el catálogo activo |
| RN-16 | Las enfermedades del donante no bloquean automáticamente una donación | El personal médico es quien decide con base en la información presentada |

---

## 6. Reglas de Integridad de Datos

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-17 | El código de donante debe ser único | No se pueden registrar dos donantes con el mismo código |
| RN-18 | El documento de identidad debe ser único | No se pueden registrar dos donantes con el mismo número de documento |
| RN-19 | El código de donación debe ser único | No se pueden registrar dos donaciones con el mismo código |
| RN-20 | Una donación debe referenciar a un donante existente | No se puede registrar una donación sin un donante válido vinculado |
| RN-21 | No se eliminan registros físicamente | Donantes, donaciones, usuarios y catálogos se desactivan, no se eliminan |
| RN-22 | Los catálogos inactivos no afectan registros históricos | Desactivar un elemento de catálogo no altera los registros existentes que lo usan |

---

## 7. Reglas de Usuarios y Acceso

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-23 | Todo acceso requiere autenticación | No existe ninguna página o función accesible sin sesión activa |
| RN-24 | El email de usuario debe ser único | No pueden existir dos usuarios con el mismo email |
| RN-25 | Un usuario desactivado no puede iniciar sesión | Aunque el proveedor OAuth lo autentique, el sistema bloquea el acceso si el usuario está inactivo |
| RN-26 | Solo el Administrador puede gestionar usuarios y catálogos | Los demás roles no tienen acceso a estas funciones aunque conozcan la URL |
| RN-27 | Toda acción sensible se registra en auditoría | Creación, edición, desactivación de donantes, donaciones, usuarios y catálogos siempre genera un registro de auditoría |

---

## 8. Reglas de Catálogos

| ID | Regla | Descripción |
|----|-------|-------------|
| RN-28 | Los nombres de catálogo deben ser únicos dentro de su tabla | Ejemplo: no pueden existir dos enfermedades con el mismo nombre |
| RN-29 | Los elementos de catálogo no se eliminan físicamente | Solo se desactivan para preservar la integridad histórica |
| RN-30 | Los catálogos deben tener al menos un elemento activo | El sistema debe garantizar que cada catálogo tenga opciones disponibles para los formularios |

---

## 9. Resumen de Grupos Sanguíneos Válidos

Los grupos sanguíneos que el sistema debe reconocer son los 8 tipos del sistema ABO con factor Rh:

| Grupo | Descripción |
|-------|-------------|
| A+ | Grupo A, factor Rh positivo |
| A- | Grupo A, factor Rh negativo |
| B+ | Grupo B, factor Rh positivo |
| B- | Grupo B, factor Rh negativo |
| AB+ | Grupo AB, factor Rh positivo |
| AB- | Grupo AB, factor Rh negativo |
| O+ | Grupo O, factor Rh positivo |
| O- | Grupo O, factor Rh negativo (donante universal) |

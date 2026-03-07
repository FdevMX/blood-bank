# Documentación del Sistema — Banco de Sangre

## Descripción General

Este repositorio de documentación describe el diseño completo del sistema **Banco de Sangre**, una aplicación web para la gestión integral de donantes, donaciones, inventario de sangre y reportes médicos.

La aplicación prioriza la seguridad, la integridad de datos médicos y la trazabilidad de cada unidad de sangre recolectada. El proyecto es evaluado en el contexto de la materia de **Ciberseguridad**, por lo que todos los requisitos de seguridad son de carácter obligatorio.

---

## Estructura de la Documentación

```
docs/
├── README.md                                  ← Este archivo (índice general)
│
├── 1_requisitos/                              ← Qué debe hacer el sistema
│   ├── 01_requisitos_generales.md             ← Objetivos, roles, RF y RNF
│   ├── 02_modulos.md                          ← Módulos con funcionalidades detalladas
│   ├── 03_reglas_de_negocio.md                ← Reglas médicas y lógica del dominio
│   └── 04_fases_de_desarrollo.md              ← Plan de desarrollo ordenado por fases
│
├── 2_base_de_datos/                           ← Diseño de la base de datos
│   ├── 01_tablas_y_campos.md                  ← Tablas con campos, tipos y restricciones
│   ├── 02_diagrama_er.md                      ← Diagrama Entidad-Relación (Mermaid)
│   └── 03_relaciones.md                       ← Descripción detallada de relaciones
│
├── 3_tecnico/                                 ← Decisiones técnicas del proyecto
│   ├── 01_stack_tecnologico.md                ← Tecnologías seleccionadas y su propósito
│   ├── 02_arquitectura.md                     ← Arquitectura del sistema con diagrama
│   └── 03_estructura_proyecto.md              ← Estructura de carpetas del proyecto
│
├── 4_seguridad/                               ← Requisitos y controles de seguridad
│   ├── 01_checklist_owasp.md                  ← OWASP Top 10 aplicado al proyecto
│   ├── 02_autenticacion.md                    ← OAuth 2.0, sesiones y control por roles
│   └── 03_politicas_datos.md                  ← Manejo seguro de datos sensibles
│
└── 5_diagramas/                               ← Diagramas de diseño y flujo
    ├── 01_arquitectura_sistema.md             ← Diagrama de arquitectura general
    ├── 02_flujo_donante.md                    ← Flujo de gestión de donantes
    ├── 03_flujo_donacion.md                   ← Flujo de registro de donaciones
    └── 04_flujo_autenticacion.md              ← Flujo de autenticación OAuth 2.0
```

---

## Orden de Lectura Recomendado

| Orden | Archivo | Propósito |
|-------|---------|-----------|
| 1 | `1_requisitos/01_requisitos_generales.md` | Comprender qué es el sistema y quiénes lo usan |
| 2 | `1_requisitos/02_modulos.md` | Ver las funcionalidades detalladas de cada módulo |
| 3 | `1_requisitos/03_reglas_de_negocio.md` | Entender las reglas que gobiernan los datos médicos |
| 4 | `1_requisitos/04_fases_de_desarrollo.md` | Plan de implementación por fases |
| 5 | `2_base_de_datos/01_tablas_y_campos.md` | Conocer la estructura completa de datos |
| 6 | `2_base_de_datos/02_diagrama_er.md` | Ver el diagrama entidad-relación |
| 7 | `2_base_de_datos/03_relaciones.md` | Entender cómo se relacionan las tablas |
| 8 | `3_tecnico/01_stack_tecnologico.md` | Tecnologías a utilizar |
| 9 | `3_tecnico/02_arquitectura.md` | Cómo está organizado el sistema |
| 10 | `3_tecnico/03_estructura_proyecto.md` | Estructura de carpetas del proyecto |
| 11 | `4_seguridad/01_checklist_owasp.md` | Lista de controles de seguridad obligatorios |
| 12 | `4_seguridad/02_autenticacion.md` | Implementación de autenticación y autorización |
| 13 | `4_seguridad/03_politicas_datos.md` | Políticas para datos sensibles |
| 14 | `5_diagramas/` | Consultar diagramas según necesidad |

---

## Contexto del Proyecto

| Atributo | Detalle |
|----------|---------|
| **Tipo** | Aplicación web de gestión interna |
| **Audiencia** | Personal médico y administrativo de un banco de sangre |
| **Enfoque principal** | Seguridad, integridad de datos y trazabilidad médica |
| **Materia** | Ciberseguridad — los controles de seguridad son obligatorios |
| **Tablas mínimas** | 9 tablas (supera el mínimo requerido de 6) |
| **Destino** | Despliegue en hosting en producción |

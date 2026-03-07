# Diagrama de Flujo — Gestión de Donaciones

Este documento muestra los flujos de los procesos principales del módulo de Gestión de Donaciones.

> Para visualizar estos diagramas, abrir en VS Code con la extensión **Markdown Preview Mermaid Support**, o pegar en [mermaid.live](https://mermaid.live).

---

## 1. Flujo de Registro de Nueva Donación

```mermaid
flowchart TD
    A([Inicio]) --> B["Operador o Administrador\naccede a /donaciones/nueva"]
    B --> C["Sistema verifica sesión y rol"]
    C --> D{¿Tiene permiso?}
    D -- No --> E[/"Error 403 — Acceso denegado"/]
    D -- Sí --> F["Muestra buscador de donantes"]
    F --> G["Usuario ingresa nombre, código\no documento del donante"]
    G --> H["Sistema consulta donantes activos\nque coincidan con el criterio"]
    H --> I{¿Se encontró\nel donante?}
    I -- No --> J[/"Mensaje: 'No se encontró\nningún donante activo'"/]
    J --> F
    I -- Sí --> K["Muestra lista de resultados\npara selección"]
    K --> L["Usuario selecciona el donante"]
    L --> M["Sistema verifica elegibilidad\ndel donante seleccionado"]
    M --> N{¿Donante elegible?}
    N -- No --> O[/"Muestra razón de no elegibilidad\nNo se puede continuar con la donación\n(ej: 'Faltan 45 días para poder donar nuevamente')"/]
    N -- Sí --> P["Muestra indicador de elegibilidad\ny formulario completo de donación"]
    P --> Q["Operador completa el formulario:\n- Código de donación (único)\n- Fecha y hora\n- Cantidad en ml\n- Grupo sanguíneo\n- Tipo de donante\n- Clasificación (ÚTIL / NO ÚTIL)\n- Parámetros médicos: Temperatura,\n  Peso, LSO, Hemoglobina, Tensión arterial\n- Fecha de vencimiento\n- Ubicación de almacenamiento\n- Observaciones (opcional)"]
    Q --> R["Sistema evalúa parámetros médicos\ny muestra advertencias si están\nfuera del rango recomendado\n(sin bloquear el formulario)"]
    R --> S["Validación en cliente (Zod)"]
    S --> T{¿Formulario válido?}
    T -- No --> P
    T -- Sí --> U["Usuario hace clic en 'Registrar Donación'"]
    U --> V["Server Action recibe datos"]
    V --> W["Validación en servidor (Zod)"]
    W --> X{¿Datos válidos\ny código único?}
    X -- No --> Y[/"Errores al cliente"/]
    Y --> P
    X -- Sí --> Z1["INSERT en tabla donacion\ncon estado = 'disponible'"]
    Z1 --> Z2["UPDATE en tabla donante:\nfecha_ultima_donacion = fecha de hoy"]
    Z2 --> Z3["Registra evento CREATE\nen tabla auditoria"]
    Z3 --> Z4[/"Confirmación:\n'Donación registrada exitosamente'"/]
    Z4 --> Z5["Redirige a /donaciones/{id}"]
    Z5 --> ZZ([Fin])
```

---

## 2. Flujo de Cambio de Estado de Donación (Solo Administrador)

```mermaid
flowchart TD
    A([Inicio]) --> B["Administrador accede a /donaciones/{id}"]
    B --> C["Sistema verifica rol = administrador"]
    C --> D{¿Es Administrador?}
    D -- No --> E["Botón de cambio de estado\nno se muestra en la interfaz"]
    D -- Sí --> F["Muestra opciones de estado\nsegún transiciones permitidas"]
    F --> G{Estado actual de\nla donación}
    G -- disponible --> H["Muestra opciones:\n→ Marcar como Utilizada\n→ Marcar como Descartada\n→ Marcar como Vencida"]
    G -- utilizada --> I[/"Estado final — No se puede cambiar"\nMuestra solo lectura]
    G -- descartada --> J[/"Estado final — No se puede cambiar"\nMuestra solo lectura]
    G -- vencida --> K[/"Estado final — No se puede cambiar"\nMuestra solo lectura]
    H --> L["Administrador selecciona\nel nuevo estado"]
    L --> M["Sistema muestra confirmación:\n'¿Está seguro de cambiar el estado\na {nuevo_estado}? Esta acción no se puede deshacer.'"]
    M --> N{¿Confirma?}
    N -- No --> F
    N -- Sí --> O["Server Action valida rol\n(verificación en servidor)"]
    O --> P["Toma snapshot del estado anterior"]
    P --> Q["UPDATE estado en tabla donacion"]
    Q --> R["Registra evento UPDATE\nen tabla auditoria"]
    R --> S[/"Confirmación exitosa\nMuestra el nuevo estado"/]
    S --> Z([Fin])
```

---

## 3. Diagrama de Estados de una Donación

```mermaid
stateDiagram-v2
    [*] --> disponible : Registro de donación\n(estado inicial)

    disponible --> utilizada : Administrador marca\n"Utilizada en paciente"

    disponible --> descartada : Administrador marca\n"Descartada por estándares"

    disponible --> vencida : Administrador marca\n"Venció sin usar"

    note right of disponible
        La unidad está almacenada
        y puede ser utilizada.
        Aparece en reporte
        de inventario.
    end note

    note right of utilizada
        Estado Final.
        No puede cambiar.
        La unidad fue usada
        en un paciente.
    end note

    note right of descartada
        Estado Final.
        No puede cambiar.
        La unidad no cumplió
        con los estándares médicos.
    end note

    note right of vencida
        Estado Final.
        No puede cambiar.
        La unidad superó la
        fecha de vencimiento.
    end note
```

---

## 4. Flujo de Búsqueda y Filtrado de Donaciones

```mermaid
flowchart TD
    A([Inicio]) --> B["Usuario accede a /donaciones"]
    B --> C["Sistema carga listado inicial\nde donaciones paginado (sin filtros)"]
    C --> D{¿Usuario aplica\nfiltros?}
    D -- No --> E["Muestra primeras N donaciones\nordenadas por fecha descendente"]
    D -- Sí --> F["Usuario selecciona filtros:\n- Rango de fechas\n- Grupo sanguíneo\n- Tipo de donante\n- Clasificación\n- Estado de donación\n- Buscar donante por nombre/código"]
    F --> G["Sistema ejecuta consulta\ncon filtros combinados"]
    G --> H{¿Hay resultados?}
    H -- No --> I[/"Mensaje: 'No se encontraron\ndonaciones con los filtros aplicados'"/]
    H -- Sí --> J["Muestra resultados paginados\ncon los filtros activos visibles"]
    J --> K{¿Usuario quiere\nver detalle?}
    K -- No --> Z([Fin])
    K -- Sí --> L["Navega a /donaciones/{id}"]
    L --> M["Muestra todos los datos\nde la donación + enlace al donante"]
    M --> Z
```

---

## 5. Flujo de Generación de Reporte de Donaciones (PDF)

```mermaid
flowchart TD
    A([Inicio]) --> B["Usuario accede a /reportes/donaciones"]
    B --> C["Sistema muestra formulario de filtros:\n- Fecha inicio\n- Fecha fin\n- Grupo sanguíneo (opcional)\n- Clasificación (opcional)"]
    C --> D["Usuario configura el rango\nde fechas y filtros opcionales"]
    D --> E["Usuario hace clic en 'Generar Reporte'"]
    E --> F["Sistema consulta donaciones\ncon los filtros especificados"]
    F --> G["Muestra vista previa del reporte:\n- Listado de donaciones\n- Subtotales por clasificación\n- Subtotales por grupo sanguíneo\n- Total general"]
    G --> H{¿Usuario confirma\ny exporta?}
    H -- No --> C
    H -- Sí --> I["Genera archivo PDF\ncon membrete, filtros aplicados,\ntabla de resultados y totales"]
    I --> J["Descarga automática del PDF\nen el navegador del usuario"]
    J --> Z([Fin])
```

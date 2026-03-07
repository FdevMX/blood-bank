# Diagrama de Flujo — Gestión de Donantes

Este documento muestra los flujos de los procesos principales del módulo de Gestión de Donantes.

> Para visualizar estos diagramas, abrir en VS Code con la extensión **Markdown Preview Mermaid Support**, o pegar en [mermaid.live](https://mermaid.live).

---

## 1. Flujo de Registro de Nuevo Donante

```mermaid
flowchart TD
    A([Inicio]) --> B["Operador o Administrador\naccede a /donantes/nuevo"]
    B --> C["Sistema verifica sesión y rol"]
    C --> D{¿Tiene permiso?}
    D -- No --> E[/"Muestra Error 403\nAcceso denegado"/]
    D -- Sí --> F["Muestra formulario de\nnuevo donante"]
    F --> G["Usuario completa el formulario:\n- Datos personales\n- Datos de contacto\n- Datos laborales\n- Datos médicos\n- Enfermedades recientes (selección múltiple)\n- Tipo de donante\n- Grupo sanguíneo"]
    G --> H["Validación en cliente (Zod)\nmuestra errores en tiempo real"]
    H --> I{¿Formulario válido?}
    I -- No --> F
    I -- Sí --> J["Usuario hace clic en 'Guardar'"]
    J --> K["Server Action recibe datos"]
    K --> L["Validación en servidor (Zod)"]
    L --> M{¿Datos válidos?}
    M -- No --> N[/"Devuelve errores al cliente"/]
    N --> F
    M -- Sí --> O["Verifica que código y\ndocumento no existan"]
    O --> P{¿Datos únicos?}
    P -- No --> Q[/"Error: 'El código ya existe'\no 'El documento ya está registrado'"/]
    Q --> F
    P -- Sí --> R["INSERT en tabla donante"]
    R --> S["INSERT en tabla donante_enfermedad\n(por cada enfermedad seleccionada)"]
    S --> T["Registra evento CREATE\nen tabla auditoria"]
    T --> U[/"Muestra confirmación:\n'Donante registrado exitosamente'"/]
    U --> V["Redirige a /donantes/{id}\n(detalle del donante)"]
    V --> Z([Fin])
```

---

## 2. Flujo de Edición de Donante

```mermaid
flowchart TD
    A([Inicio]) --> B["Usuario accede a /donantes/{id}/editar"]
    B --> C["Sistema verifica sesión y rol"]
    C --> D{¿Tiene permiso?}
    D -- No --> E[/"Error 403"/]
    D -- Sí --> F["Carga datos actuales del donante\ndesde la base de datos"]
    F --> G["Muestra formulario de edición\nprecargado con datos actuales"]
    G --> H["Usuario modifica campos deseados"]
    H --> I["Validación en cliente (Zod)"]
    I --> J{¿Formulario válido?}
    J -- No --> G
    J -- Sí --> K["Usuario hace clic en 'Actualizar'"]
    K --> L["Server Action recibe datos"]
    L --> M["Validación en servidor (Zod)"]
    M --> N{¿Datos válidos?}
    N -- No --> O[/"Errores al cliente"/]
    O --> G
    N -- Sí --> P["Toma snapshot de datos actuales\n(para auditoría)"]
    P --> Q["UPDATE en tabla donante"]
    Q --> R["DELETE + INSERT en donante_enfermedad\n(reemplaza enfermedades seleccionadas)"]
    R --> S["Registra evento UPDATE en auditoria\ncon datos_anteriores y datos_nuevos"]
    S --> T[/"Muestra confirmación:\n'Donante actualizado exitosamente'"/]
    T --> U["Redirige a /donantes/{id}"]
    U --> Z([Fin])
```

---

## 3. Flujo de Consulta de Detalle del Donante

```mermaid
flowchart TD
    A([Inicio]) --> B["Usuario accede a /donantes/{id}"]
    B --> C["Sistema verifica sesión activa"]
    C --> D{¿Sesión válida?}
    D -- No --> E["Redirige a /login"]
    D -- Sí --> F["Consulta datos del donante por ID\nincluyendo tipo, grupo sanguíneo\ny enfermedades asociadas"]
    F --> G{¿Donante existe?}
    G -- No --> H[/"Error 404: Donante no encontrado"/]
    G -- Sí --> I["Calcula elegibilidad del donante:\n¿Pasaron 90 días desde última donación?\n¿Edad entre 18 y 65 años?\n¿Estado activo?"]
    I --> J["Consulta historial de donaciones\ndel donante"]
    J --> K["Muestra vista de detalle completa:\n- Datos personales y médicos\n- Enfermedades recientes\n- Indicador de elegibilidad con fecha\n- Historial de donaciones en tabla"]
    K --> Z([Fin])
```

---

## 4. Diagrama de Estados del Donante

```mermaid
stateDiagram-v2
    [*] --> activo : Registro nuevo

    activo --> inactivo : Desactivación por\nAdmin u Operador

    inactivo --> activo : Reactivación por\nAdministrador

    activo --> activo : Se registra\nnueva donación\n(actualiza fecha_ultima_donacion)

    note right of activo
        El donante activo puede:
        - Tener donaciones registradas
        - Aparecer en búsquedas
        - Ser editado
    end note

    note right of inactivo
        El donante inactivo:
        - NO puede tener nuevas donaciones
        - Aparece marcado en búsquedas
        - Conserva su historial completo
        - NO puede ser editado
    end note
```

---

## 5. Flujo de Verificación de Elegibilidad

```mermaid
flowchart TD
    A([Consultar elegibilidad]) --> B["Obtener datos del donante:\nfecha_nacimiento, fecha_ultima_donacion, estado"]
    B --> C{¿Estado = activo?}
    C -- No --> D[/"❌ No elegible\nRazón: Donante inactivo"/]
    C -- Sí --> E["Calcular edad actual\na partir de fecha_nacimiento"]
    E --> F{¿Edad entre 18 y 65?}
    F -- No --> G[/"❌ No elegible\nRazón: Edad fuera del rango permitido\n(min: 18, max: 65)"/]
    F -- Sí --> H{¿Tiene fecha de\núltima donación?}
    H -- No tiene --> I[/"✅ Elegible\nNunca ha donado"/]
    H -- Sí tiene --> J["Calcular días desde\nfecha_ultima_donacion"]
    J --> K{¿Pasaron al menos\n90 días?}
    K -- Sí --> L[/"✅ Elegible para donar"/]
    K -- No --> M["Calcular fecha en que\npodrá donar nuevamente\n(fecha_ultima_donacion + 90 días)"]
    M --> N[/"❌ No elegible\nRazón: Tiempo insuficiente\nPodrá donar desde: {fecha}"/]
```

# Diagrama de Arquitectura del Sistema

Este diagrama muestra la arquitectura completa del sistema Banco de Sangre, incluyendo las capas de presentación, aplicación, datos y persistencia, así como los flujos de comunicación entre ellas.

> Para visualizar estos diagramas, abrir en VS Code con la extensión **Markdown Preview Mermaid Support**, o pegar en [mermaid.live](https://mermaid.live).

---

## 1. Arquitectura General del Sistema

```mermaid
graph TB

    subgraph usuario_final["Usuario Final"]
        Browser["Navegador Web\n(Chrome / Firefox / Edge)"]
    end

    subgraph next_app["Aplicación Next.js — Servidor"]
        direction TB

        subgraph capa_presentacion["Capa de Presentación"]
            ServerComp["Server Components\n(React + shadcn)"]
            ClientComp["Client Components\n(Forms, Tables)"]
        end

        subgraph capa_aplicacion["Capa de Aplicación"]
            Middleware["Middleware\n(Autenticación + Roles)"]
            ServerActions["Server Actions\n(Lógica de Negocio)"]
            Validation["Validación Zod\n(Datos de Entrada)"]
            AuditFn["Función de Auditoría\n(Transversal)"]
            PDFGen["Generador PDF\n(Reportes)"]
        end

        subgraph capa_datos["Capa de Datos"]
            Prisma["Prisma ORM\n(Consultas Parametrizadas)"]
        end
    end

    subgraph auth_layer["Capa de Autenticación"]
        AuthJS["Auth.js\n(Gestión de Sesiones)"]
        OAuthProvider["Proveedor OAuth 2.0\n(Externo)"]
    end

    subgraph db_layer["Capa de Persistencia"]
        PostgreSQL[("PostgreSQL\nBase de Datos")]
    end

    Browser -- "HTTPS" --> Middleware
    Middleware --> AuthJS
    AuthJS -- "Authorization Code Flow" --> OAuthProvider
    OAuthProvider -- "Tokens" --> AuthJS
    Middleware --> ServerComp
    ServerComp --> ClientComp
    ServerComp --> ServerActions
    ClientComp --> ServerActions
    ServerActions --> Validation
    Validation --> Prisma
    ServerActions --> AuditFn
    AuditFn --> Prisma
    ServerActions --> PDFGen
    Prisma -- "SQL Parametrizado" --> PostgreSQL
    PostgreSQL -- "Resultados" --> Prisma
```

---

## 2. Diagrama de Capas con Responsabilidades

```mermaid
graph LR

    subgraph L1["1. Presentación\n(Cliente)"]
        A["Páginas Next.js\n(Server Components)"]
        B["Componentes shadcn\n(Formularios, Tablas)"]
        C["Validación cliente\n(Zod en browser)"]
    end

    subgraph L2["2. Aplicación\n(Servidor Next.js)"]
        D["Middleware de Auth\n(Protección de rutas)"]
        E["Server Actions\n(Lógica de negocio)"]
        F["Validación servidor\n(Zod en server)"]
        G["Control de roles\n(RBAC)"]
        H["Registro de auditoría\n(Función centralizada)"]
    end

    subgraph L3["3. Datos\n(ORM)"]
        I["Prisma Client\n(Type-safe queries)"]
        J["Prisma Schema\n(Fuente de verdad)"]
    end

    subgraph L4["4. Persistencia\n(Base de Datos)"]
        K[("PostgreSQL\n9 tablas\nForeign Keys\nIntegridad referencial")]
    end

    A --> D
    B --> E
    C --> E
    D --> G
    G --> E
    E --> F
    F --> I
    E --> H
    H --> I
    I --> K
    J --> K
```

---

## 3. Diagrama de Despliegue

```mermaid
graph TB

    subgraph internet["Internet"]
        User["Usuario\nNavegador Web"]
    end

    subgraph hosting["Servidor de Hosting (Node.js)"]
        NextApp["Aplicación Next.js\nPuerto 443 (HTTPS)"]
        EnvVars[".env — Variables de Entorno\n(Secretos del sistema)"]
    end

    subgraph db_server["Servidor de Base de Datos (Cloud)"]
        PG[("PostgreSQL\nPuerto 5432\n(Solo accesible desde App)")]
    end

    subgraph oauth_provider["Proveedor OAuth (Externo)"]
        OAuth["Servicio OAuth 2.0\n(Google / GitHub / etc.)"]
    end

    User -- "HTTPS :443" --> NextApp
    NextApp -- "Conexión SSL\nDATABASE_URL" --> PG
    NextApp -- "Authorization Code Flow\nHTTPS" --> OAuth
    OAuth -- "Tokens JWT" --> NextApp
    EnvVars --> NextApp

    style PG fill:#336791,color:#fff
    style NextApp fill:#000,color:#fff
    style OAuth fill:#4285F4,color:#fff
```

---

## 4. Flujo de una Solicitud Protegida

```mermaid
sequenceDiagram
    actor U as Usuario
    participant MW as Middleware
    participant SA as Server Action
    participant ZD as Validación Zod
    participant PR as Prisma ORM
    participant DB as PostgreSQL
    participant AU as Auditoría

    U->>MW: Solicita acción (ej: crear donante)
    MW->>MW: Verifica sesión activa
    alt Sin sesión
        MW-->>U: Redirige a /login
    end
    MW->>MW: Verifica rol del usuario
    alt Rol sin permiso
        MW-->>U: Error 403 - Acceso denegado
    end
    MW->>SA: Pasa solicitud al Server Action
    SA->>SA: Verifica rol nuevamente (defensa en profundidad)
    SA->>ZD: Valida datos de entrada
    alt Datos inválidos
        ZD-->>U: Devuelve errores de validación
    end
    SA->>PR: Ejecuta consulta parametrizada
    PR->>DB: INSERT / UPDATE con parámetros
    DB-->>PR: Resultado exitoso
    PR-->>SA: Retorna datos
    SA->>AU: Registra evento en auditoría
    AU->>DB: INSERT en tabla auditoria
    SA-->>U: Confirmación exitosa
```

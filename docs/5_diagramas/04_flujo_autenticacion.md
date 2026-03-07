# Diagrama de Flujo — Autenticación OAuth 2.0

Este documento muestra en detalle el flujo de autenticación del sistema utilizando OAuth 2.0, incluyendo los casos de acceso denegado y cierre de sesión.

> Para visualizar estos diagramas, abrir en VS Code con la extensión **Markdown Preview Mermaid Support**, o pegar en [mermaid.live](https://mermaid.live).

---

## 1. Flujo Completo de Autenticación OAuth 2.0

```mermaid
sequenceDiagram
    actor U as Usuario
    participant B as Navegador
    participant MW as Middleware Next.js
    participant APP as Aplicación Next.js
    participant AUTHJS as Auth.js
    participant OAUTH as Proveedor OAuth 2.0
    participant DB as PostgreSQL
    participant AUDIT as Tabla Auditoria

    U->>B: Navega a cualquier URL del sistema
    B->>MW: GET /dashboard (o cualquier ruta protegida)
    MW->>MW: Verifica cookie de sesión
    MW-->>B: Sin sesión → Redirige a /login
    B->>APP: GET /login
    APP-->>U: Muestra página de login con botón OAuth

    U->>B: Hace clic en "Iniciar Sesión con [Proveedor]"
    B->>AUTHJS: Inicia flujo OAuth
    AUTHJS->>AUTHJS: Genera state CSRF aleatorio
    AUTHJS-->>B: Redirige al proveedor OAuth\n(con client_id, redirect_uri, scope, state)
    B->>OAUTH: GET /authorize?client_id=...&state=...
    OAUTH-->>U: Muestra formulario de login del proveedor

    U->>OAUTH: Ingresa credenciales del proveedor
    OAUTH->>OAUTH: Verifica credenciales
    alt Credenciales incorrectas
        OAUTH-->>U: Error de autenticación en el proveedor
    end
    OAUTH-->>B: Redirige a /api/auth/callback\n(con code y state verificado)
    B->>AUTHJS: GET /api/auth/callback?code=...&state=...
    AUTHJS->>AUTHJS: Verifica parámetro state (anti-CSRF)
    AUTHJS->>OAUTH: POST /token\n(intercambia code por access_token)
    OAUTH-->>AUTHJS: Devuelve access_token + id_token
    AUTHJS->>AUTHJS: Decodifica id_token\nExtrae email y nombre del usuario

    AUTHJS->>DB: SELECT * FROM usuario WHERE email = ?
    DB-->>AUTHJS: Resultado de la consulta

    alt Usuario no encontrado en BD
        AUTHJS-->>B: Redirige a /login?error=no_autorizado
        B-->>U: Muestra mensaje: "No tienes acceso al sistema"
    else Usuario encontrado pero inactivo
        AUTHJS->>AUDIT: INSERT LOGIN_BLOCKED (email, ip, fecha)
        AUTHJS-->>B: Redirige a /login?error=cuenta_inactiva
        B-->>U: Muestra mensaje: "Tu cuenta está desactivada"
    else Usuario activo
        AUTHJS->>DB: UPDATE usuario SET ultimo_acceso = NOW()
        AUTHJS->>AUDIT: INSERT LOGIN (id_usuario, ip, user_agent, fecha)
        AUTHJS->>AUTHJS: Crea sesión JWT firmada\n{id, nombre, email, rol}
        AUTHJS-->>B: Set-Cookie: sesión (HttpOnly, Secure, SameSite=Lax)
        B->>APP: Redirige a /dashboard
        APP-->>U: Muestra dashboard del sistema
    end
```

---

## 2. Flujo de Verificación de Rol en Cada Solicitud

```mermaid
flowchart TD
    A([Nueva Solicitud HTTP]) --> B["Middleware intercepta la solicitud"]
    B --> C["Lee la cookie de sesión"]
    C --> D{¿Cookie de sesión\nexiste y es válida?}
    D -- No/Expirada --> E["Redirige a /login"]
    D -- Válida --> F["Decodifica la sesión\nExtrae: id, email, rol"]
    F --> G["Verifica la ruta solicitada"]
    G --> H{¿Ruta requiere\nrol específico?}
    H -- Solo Admin\n/admin/* /catalogos/* --> I{¿Rol es\nadministrador?}
    I -- No --> J[/"Responde Error 403\nSin redirigir"/]
    I -- Sí --> K["Procesa la solicitud"]
    H -- Cualquier usuario\nautenticado --> K
    K --> L["Carga el Server Component\no ejecuta Server Action"]
    L --> M{¿Server Action\nde escritura?}
    M -- No (solo lectura) --> N["Retorna datos al cliente"]
    M -- Sí (CREATE/UPDATE/DELETE) --> O["Verifica rol nuevamente\n(defensa en profundidad)"]
    O --> P{¿Tiene permiso?}
    P -- No --> Q[/"Retorna error de\nacceso denegado"/]
    P -- Sí --> R["Ejecuta operación en BD"]
    R --> S["Registra evento en auditoría"]
    S --> T["Retorna resultado al cliente"]
    N --> Z([Fin])
    T --> Z
```

---

## 3. Flujo de Cierre de Sesión

```mermaid
sequenceDiagram
    actor U as Usuario
    participant B as Navegador
    participant AUTHJS as Auth.js
    participant DB as PostgreSQL
    participant AUDIT as Tabla Auditoria

    U->>B: Hace clic en "Cerrar Sesión"
    B->>AUTHJS: POST /api/auth/signout
    AUTHJS->>AUTHJS: Invalida el token de sesión\nen el servidor
    AUTHJS->>AUDIT: INSERT LOGOUT (id_usuario, ip, fecha)
    AUDIT-->>AUTHJS: Confirmación
    AUTHJS-->>B: Elimina la cookie de sesión\n(Set-Cookie: sesión=; Max-Age=0)
    B-->>U: Redirige a /login
    
    note over B,AUTHJS: Si el usuario intenta navegar hacia atrás\nel middleware verifica que no hay sesión válida\ny redirige a /login nuevamente
```

---

## 4. Flujo de Sesión Expirada

```mermaid
flowchart TD
    A([Usuario con sesión activa]) --> B["Período de inactividad\nsupera el tiempo configurado"]
    B --> C["El token JWT expira\nautomáticamente"]
    C --> D["Usuario intenta realizar\ncualquier acción en el sistema"]
    D --> E["Middleware verifica el token\ny detecta que está expirado"]
    E --> F["Elimina la cookie de sesión expirada"]
    F --> G[/"Redirige a /login\ncon mensaje: 'Tu sesión ha expirado,\niniciar sesión nuevamente'"/]
    G --> H["Usuario reinicia el flujo\nde autenticación OAuth 2.0"]
    H --> Z([Fin])
```

---

## 5. Diagrama de Estados de Sesión de Usuario

```mermaid
stateDiagram-v2
    [*] --> sin_sesion : Usuario no autenticado

    sin_sesion --> autenticando : Hace clic en "Iniciar Sesión"

    autenticando --> rechazado : Email no registrado\no cuenta inactiva

    rechazado --> sin_sesion : Redirige a /login\ncon mensaje de error

    autenticando --> sesion_activa : Autenticación exitosa\n(Auth.js crea JWT)

    sesion_activa --> sesion_activa : Actividad normal\n(middleware renueva el token)

    sesion_activa --> sesion_expirada : Inactividad > tiempo configurado

    sesion_expirada --> sin_sesion : Middleware detecta expiración\nElimina cookie

    sesion_activa --> sin_sesion : Usuario hace logout\n(Auth.js invalida token)

    note right of sesion_activa
        La sesión contiene:
        - ID de usuario
        - Nombre
        - Email
        - Rol
    end note

    note right of rechazado
        Se registra el intento
        fallido en la tabla
        auditoria con el email
        y la IP de origen.
    end note
```

---

## 6. Matriz de Acceso por Rol y Ruta

```mermaid
graph LR
    subgraph Rutas Públicas
        R0["/login"]
    end

    subgraph Rutas — Todos los Roles
        R1["/dashboard"]
        R2["/donantes/*"]
        R3["/donaciones/*"]
        R4["/reportes/*"]
    end

    subgraph Rutas — Solo Administrador
        R5["/catalogos/*"]
        R6["/admin/usuarios/*"]
        R7["/admin/auditoria"]
    end

    Admin([Administrador]) --> R0
    Admin --> R1
    Admin --> R2
    Admin --> R3
    Admin --> R4
    Admin --> R5
    Admin --> R6
    Admin --> R7

    Operador([Operador]) --> R0
    Operador --> R1
    Operador --> R2
    Operador --> R3
    Operador --> R4

    Consulta([Consulta]) --> R0
    Consulta --> R1
    Consulta --> R2
    Consulta --> R3
    Consulta --> R4
```

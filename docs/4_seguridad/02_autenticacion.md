# Autenticación, Sesiones y Control de Acceso

Este documento describe en detalle cómo se implementa la autenticación OAuth 2.0, la gestión de sesiones y el control de acceso basado en roles (RBAC) en el sistema Banco de Sangre.

---

## 1. Modelo de Autenticación

El sistema utiliza **OAuth 2.0** como protocolo de autenticación, implementado a través de la librería **Auth.js** (anteriormente conocida como NextAuth.js). Este modelo fue elegido porque:

- Delega la verificación de identidad a un proveedor externo confiable, evitando gestionar contraseñas directamente.
- Reduce la superficie de ataque: el sistema no almacena ni procesa credenciales sensibles.
- El proveedor OAuth se encarga de políticas como autenticación de doble factor, detección de inicios de sesión inusuales y bloqueo de cuentas comprometidas.

---

## 2. Flujo de Autenticación OAuth 2.0

El flujo implementado es el **Authorization Code Flow**, que es el flujo estándar y más seguro para aplicaciones web:

### Paso a paso:

1. El usuario accede a la aplicación y es redirigido a `/login` por el middleware.
2. El usuario hace clic en el botón de inicio de sesión.
3. La aplicación genera un `state` aleatorio (para prevenir CSRF) y redirige al proveedor OAuth con los parámetros: `client_id`, `redirect_uri`, `scope`, `response_type=code`, `state`.
4. El usuario se autentica con sus credenciales en el proveedor OAuth.
5. El proveedor redirige de vuelta a la aplicación con un `code` de autorización y el `state` verificado.
6. Auth.js intercambia el `code` por un `access_token` y un `id_token` haciendo una solicitud servidor-a-servidor al proveedor.
7. Auth.js extrae el email y el nombre del usuario del `id_token`.
8. **Verificación propia del sistema:** La aplicación busca el email en la tabla `usuario`. Si el email no existe o el usuario está inactivo, rechaza el acceso con un mensaje apropiado.
9. Si el usuario existe y está activo, se crea la sesión con los datos del usuario incluyendo su rol.
10. Se registra el evento `LOGIN` en la tabla `auditoria`.
11. El usuario es redirigido al dashboard.

### Datos almacenados en la sesión:

```
{
  id: number         → ID del usuario en la tabla usuario
  nombre: string     → Nombre del usuario
  email: string      → Email del usuario
  rol: string        → "administrador" | "operador" | "consulta"
}
```

> La sesión **no almacena** documentos de identidad, contraseñas, ni datos sensibles adicionales.

---

## 3. Gestión de Sesiones

| Aspecto | Implementación |
|---------|----------------|
| **Tipo de sesión** | JWT firmado con `NEXTAUTH_SECRET` (o sesión en base de datos para mayor seguridad) |
| **Duración de sesión** | Configurable. Valor recomendado: 8 horas (jornada laboral) |
| **Expiración por inactividad** | La sesión expira si no hay actividad en el período configurado |
| **Renovación automática** | Auth.js puede renovar tokens silenciosamente antes de su expiración |
| **Invalidación al cerrar sesión** | El logout llama a `signOut()` de Auth.js, que invalida el token en el servidor |
| **Almacenamiento en cliente** | Cookie HttpOnly con flags `Secure` y `SameSite=Lax` |

### Atributos de la cookie de sesión:

| Atributo | Valor | Propósito |
|----------|-------|-----------|
| `HttpOnly` | true | Previene acceso a la cookie desde JavaScript del cliente (previene XSS) |
| `Secure` | true (en producción) | La cookie solo se envía sobre HTTPS |
| `SameSite` | Lax | Previene ataques CSRF de cross-site |
| `Path` | / | La cookie aplica a toda la aplicación |

---

## 4. Control de Acceso por Roles (RBAC)

### 4.1 Matriz de Permisos por Módulo

| Módulo / Acción | Administrador | Operador | Consulta |
|-----------------|:---:|:---:|:---:|
| **Dashboard** | ✓ | ✓ | ✓ |
| **Donantes — Ver listado** | ✓ | ✓ | ✓ |
| **Donantes — Ver detalle** | ✓ | ✓ | ✓ |
| **Donantes — Crear** | ✓ | ✓ | ✗ |
| **Donantes — Editar** | ✓ | ✓ | ✗ |
| **Donantes — Desactivar** | ✓ | ✓ | ✗ |
| **Donaciones — Ver listado** | ✓ | ✓ | ✓ |
| **Donaciones — Ver detalle** | ✓ | ✓ | ✓ |
| **Donaciones — Crear** | ✓ | ✓ | ✗ |
| **Donaciones — Cambiar estado** | ✓ | ✗ | ✗ |
| **Reportes — Generar** | ✓ | ✓ | ✓ |
| **Reportes — Exportar PDF** | ✓ | ✓ | ✓ |
| **Catálogos — Ver** | ✓ | ✗ | ✗ |
| **Catálogos — Crear/Editar/Desactivar** | ✓ | ✗ | ✗ |
| **Usuarios — Ver listado** | ✓ | ✗ | ✗ |
| **Usuarios — Crear/Editar/Desactivar** | ✓ | ✗ | ✗ |
| **Auditoría — Ver log** | ✓ | ✗ | ✗ |

### 4.2 Implementación del Control de Acceso

El control de acceso se aplica en **dos capas independientes**:

**Capa 1 — Middleware de Next.js (`src/middleware.ts`):**
- Se ejecuta antes de cargar cualquier página o API Route.
- Verifica la existencia y validez de la sesión.
- Verifica si el rol tiene acceso a la ruta solicitada.
- En caso de acceso denegado, redirige a login o muestra 403 según el caso.

**Capa 2 — Server Actions (`src/actions/`):**
- Cada función que escribe datos verifica nuevamente el rol del usuario.
- Esta "defensa en profundidad" previene que un atacante que evite el middleware igual pueda ejecutar acciones.
- Si el rol no tiene permiso, la función retorna un error sin ejecutar ninguna operación en la base de datos.

### 4.3 Rutas por Rol

| Rutas | Roles con acceso |
|-------|-----------------|
| `/login` | Público (sin autenticación) |
| `/dashboard`, `/donantes/*`, `/donaciones/*`, `/reportes/*` | Todos los roles autenticados |
| `/catalogos/*` | Solo `administrador` |
| `/admin/*` (usuarios y auditoría) | Solo `administrador` |

---

## 5. Protección Contra Ataques Comunes

### CSRF (Cross-Site Request Forgery)
- Auth.js implementa protección CSRF automáticamente en el flujo OAuth con el parámetro `state`.
- Los Server Actions de Next.js tienen protección CSRF integrada: solo aceptan solicitudes con el `Content-Type` correcto y con el origen verificado.
- La cookie de sesión tiene el atributo `SameSite=Lax`, lo que previene que sitios externos puedan usar la sesión del usuario.

### Session Fixation
- Al completar el login exitosamente, Auth.js genera un nuevo token de sesión. El token no se reutiliza de una sesión no autenticada.

### Brute Force
- Dado que la autenticación se delega al proveedor OAuth, el proveedor es responsable de las políticas de bloqueo por intentos fallidos.
- El sistema registra todos los intentos de login (incluyendo fallidos) en auditoría para detección manual.

### Clickjacking
- El header `X-Frame-Options: DENY` en `next.config.js` previene que la aplicación sea embebida en iframes de otros sitios.

---

## 6. Registro de Sesiones en Auditoría

Todos los siguientes eventos de autenticación se registran en la tabla `auditoria`:

| Evento | Acción registrada | Datos almacenados |
|--------|-------------------|-------------------|
| Login exitoso | `LOGIN` | IP, user_agent, id_usuario, fecha |
| Login rechazado (usuario inactivo) | `LOGIN_BLOCKED` | IP, user_agent, email intentado, fecha |
| Cierre de sesión | `LOGOUT` | IP, id_usuario, fecha |
| Acceso denegado por rol | `ACCESS_DENIED` | IP, id_usuario, ruta solicitada, fecha |

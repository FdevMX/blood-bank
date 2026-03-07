# Políticas de Manejo de Datos Sensibles

Este documento define las políticas y controles que el sistema debe aplicar para el manejo seguro de la información sensible que gestiona.

---

## 1. Clasificación de Datos por Sensibilidad

El sistema maneja datos de distinto nivel de sensibilidad. Cada categoría requiere controles específicos.

| Categoría | Campos | Nivel de Sensibilidad | Justificación |
|-----------|--------|-----------------------|---------------|
| **Datos de autenticación** | `password_hash`, `NEXTAUTH_SECRET`, credenciales OAuth | Crítico | Compromiso de estas credenciales permite acceso no autorizado al sistema |
| **Datos médicos** | `enfermedades`, `hemoglobina`, `temperatura`, `tension_arterial`, `peso`, `lso` | Alto | Datos de salud protegidos por ética médica y normativas de privacidad |
| **Datos de identidad** | `documento_identidad`, `fecha_nacimiento`, `nombres`, `apellidos` | Alto | Datos personales identificables (PII — Personally Identifiable Information) |
| **Datos de contacto** | `telefono`, `email`, `direccion` | Medio | Información personal que puede usarse para contactar o rastrear al donante |
| **Datos operacionales** | `codigo`, `fecha_donacion`, `grupo_sanguineo`, `estado_donacion` | Medio | Datos del negocio necesarios para la operación del banco de sangre |
| **Datos de auditoría** | `ip_address`, `user_agent`, `datos_anteriores`, `datos_nuevos` | Medio | Información de trazabilidad, accesible solo para Administrador |
| **Datos de catálogos** | Enfermedades, tipos de donante, clasificaciones, grupos sanguíneos | Bajo | Datos de referencia sin contenido sensible |

---

## 2. Políticas de Almacenamiento

### 2.1 Contraseñas y Secretos
- Ninguna contraseña ni secreto se almacena en texto plano.
- Si se implementa autenticación local (complementaria al OAuth), las contraseñas se almacenan con **bcrypt** con un factor de costo de al menos 12.
- Los secretos del sistema (`NEXTAUTH_SECRET`, cadena de conexión a BD, credenciales OAuth) se almacenan únicamente en variables de entorno del servidor.
- No se incluyen valores de secretos en el código fuente, ni en archivos de configuración subidos al repositorio.

### 2.2 Datos Médicos y Personales
- Los datos médicos y personales se almacenan en la base de datos PostgreSQL de forma normalizada.
- No se almacenan en logs del servidor ni en archivos temporales.
- El acceso a estos datos está restringido por el sistema de roles.
- En la tabla `auditoria`, los snapshots `datos_anteriores` y `datos_nuevos` pueden contener datos personales. El acceso a la auditoría está restringido exclusivamente al Administrador.

### 2.3 Datos de Sesión
- Las sesiones solo contienen el ID de usuario, nombre, email y rol. No incluyen datos médicos ni documentos de identidad.
- Los tokens de sesión están firmados con `NEXTAUTH_SECRET` para garantizar su integridad.

---

## 3. Políticas de Transmisión

| Regla | Descripción |
|-------|-------------|
| HTTPS obligatorio | Toda comunicación cliente-servidor en producción ocurre bajo HTTPS (TLS). HTTP redirige automáticamente a HTTPS. |
| Datos sensibles en body | Los documentos de identidad, datos médicos y otros campos sensibles se transmiten en el cuerpo de las solicitudes POST/PUT, nunca como parámetros en la URL. |
| No exponer IDs predecibles en URL cuando sean sensibles | Los recursos se identifican por ID numérico en la URL (ej: `/donantes/42`), lo cual es aceptable ya que el control de acceso previene acceso sin autorización. |

---

## 4. Políticas de Acceso a Datos

### 4.1 Principio de Mínimo Privilegio
Cada rol del sistema accede únicamente a los datos que necesita para sus funciones:

| Dato | Administrador | Operador | Consulta |
|------|:---:|:---:|:---:|
| Datos personales del donante | ✓ | ✓ | ✓ |
| Datos médicos del donante y donaciones | ✓ | ✓ | ✓ |
| Contraseñas (hash) de usuarios | ✗ | ✗ | ✗ |
| Log de auditoría completo | ✓ | ✗ | ✗ |
| Credenciales del sistema (variables de entorno) | Solo acceso al servidor | ✗ | ✗ |

> Ningún rol del sistema puede ver contraseñas en texto plano ni el hash de contraseñas de otros usuarios, ya que esta información solo existe en la columna `password_hash` y no se expone en ninguna API ni interfaz.

### 4.2 No Eliminación de Datos Históricos
Los registros de donantes, donaciones y usuarios solo se desactivan, nunca se eliminan físicamente. Esto garantiza:
- La integridad del historial médico de los donantes.
- La trazabilidad completa de las unidades de sangre.
- La preservación del log de auditoría.

### 4.3 Restricción de Acceso a la Base de Datos
- El usuario de base de datos utilizado por la aplicación debe tener permisos mínimos necesarios: SELECT, INSERT, UPDATE sobre las tablas del sistema.
- No debe tener permisos de DROP TABLE, DROP DATABASE ni acceso al sistema de archivos del servidor de base de datos.
- La base de datos no debe ser accesible desde internet; solo la aplicación Next.js puede conectarse a ella.

---

## 5. Políticas de Exposición en la Interfaz

| Regla | Descripción |
|-------|-------------|
| Validación de salida | Todos los datos que provienen de la base de datos y se renderizan en HTML deben escaparse para prevenir XSS. React hace esto por defecto; no se debe usar `dangerouslySetInnerHTML` con datos de la BD. |
| Mensajes de error genéricos | Los errores que se muestran al usuario no deben revelar detalles técnicos como nombres de tablas, mensajes de base de datos ni stack traces. |
| Paginación de resultados | Los listados de donantes y donaciones deben estar paginados. No se deben retornar todos los registros de una tabla en una sola consulta sin límite. |
| No exponer datos de otros usuarios | Un operador solo debe poder ver sus propias acciones en su contexto de trabajo. No existe un perfil público de usuarios del sistema. |

---

## 6. Política de Variables de Entorno

Las siguientes variables de entorno contienen información sensible y deben gestionarse con cuidado:

| Variable | Sensibilidad | Política |
|----------|-------------|----------|
| `DATABASE_URL` | Crítico | Solo en el servidor. Incluye usuario, contraseña y host de la BD. Nunca en el repositorio. |
| `NEXTAUTH_SECRET` | Crítico | Mínimo 32 caracteres aleatorios. Si se compromete, todos los tokens de sesión son inválidos y se debe rotar. |
| `OAUTH_CLIENT_SECRET` | Crítico | Secreto del proveedor OAuth. Si se compromete, se debe revocar y generar uno nuevo en el panel del proveedor. |
| `NEXTAUTH_URL` | Bajo | URL pública de la aplicación. Puede estar en el repositorio si es la URL de producción. |
| `OAUTH_CLIENT_ID` | Bajo | ID público del cliente OAuth. No es secreto por sí solo. |

### Rotación de secretos
- Si `NEXTAUTH_SECRET` es comprometido, debe rotarse inmediatamente. Todas las sesiones activas serán invalidadas automáticamente.
- Si `OAUTH_CLIENT_SECRET` es comprometido, debe revocarse en el panel del proveedor OAuth y generar uno nuevo.
- Después de una rotación, se deben actualizar las variables de entorno en el servidor de producción y reiniciar la aplicación.

---

## 7. Política de Retención de Datos de Auditoría

- Los registros de auditoría se conservan indefinidamente como principio general, ya que son datos de trazabilidad médica.
- Los registros de auditoría nunca se eliminan desde la interfaz del sistema.
- Si se requiere purga de datos de auditoría por razones legales o de capacidad, debe ser realizada directamente en la base de datos por el administrador del servidor, no desde la aplicación.

---

## 8. Exposición de Información en Headers HTTP

La aplicación debe configurar los siguientes headers HTTP de seguridad en `next.config.js`:

| Header | Valor recomendado | Propósito |
|--------|-------------------|-----------|
| `X-Frame-Options` | `DENY` | Previene clickjacking al no permitir que la app sea embebida en iframes |
| `X-Content-Type-Options` | `nosniff` | Previene que el navegador interprete archivos con un MIME type distinto al declarado |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla qué información de referencia se incluye en solicitudes externas |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Fuerza HTTPS en el navegador del usuario por 1 año |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Deshabilita APIs del navegador no necesarias para la aplicación |
| `Content-Security-Policy` | Configurado para bloquear scripts de orígenes no permitidos | Previene XSS limitando los orígenes desde los que se pueden cargar scripts |

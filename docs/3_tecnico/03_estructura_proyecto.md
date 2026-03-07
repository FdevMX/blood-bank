# Estructura del Proyecto

Este documento define la organización de carpetas y archivos del proyecto Next.js. La estructura sigue las convenciones del App Router de Next.js y separa claramente las responsabilidades.

---

## 1. Estructura General de Carpetas

```
bancodesangre-app/
│
├── .env                            ← Variables de entorno locales (NO subir a Git)
├── .env.example                    ← Plantilla de variables de entorno (SÍ subir a Git)
├── .gitignore
├── next.config.js                  ← Configuración de Next.js
├── tailwind.config.js              ← Configuración de Tailwind CSS
├── tsconfig.json                   ← Configuración de TypeScript
├── package.json
│
├── prisma/
│   ├── schema.prisma               ← Definición completa de la base de datos
│   ├── migrations/                 ← Historial de migraciones generadas automáticamente
│   └── seed.ts                     ← Script para cargar datos iniciales (catálogos)
│
├── public/
│   └── logo.svg                    ← Recursos estáticos públicos
│
└── src/
    ├── app/                        ← App Router de Next.js (páginas y rutas)
    │   ├── layout.tsx              ← Layout raíz de la aplicación
    │   ├── page.tsx                ← Página de inicio (redirige a /dashboard)
    │   │
    │   ├── (auth)/                 ← Grupo de rutas públicas (sin autenticación requerida)
    │   │   └── login/
    │   │       └── page.tsx        ← Página de inicio de sesión
    │   │
    │   ├── (dashboard)/            ← Grupo de rutas protegidas (requieren autenticación)
    │   │   ├── layout.tsx          ← Layout con barra de navegación y menú lateral
    │   │   ├── dashboard/
    │   │   │   └── page.tsx        ← Pantalla principal con resumen del sistema
    │   │   │
    │   │   ├── donantes/
    │   │   │   ├── page.tsx        ← Listado de donantes
    │   │   │   ├── nuevo/
    │   │   │   │   └── page.tsx    ← Formulario de registro de nuevo donante
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx    ← Detalle del donante
    │   │   │       └── editar/
    │   │   │           └── page.tsx ← Formulario de edición del donante
    │   │   │
    │   │   ├── donaciones/
    │   │   │   ├── page.tsx        ← Listado de donaciones
    │   │   │   ├── nueva/
    │   │   │   │   └── page.tsx    ← Formulario de registro de donación
    │   │   │   └── [id]/
    │   │   │       └── page.tsx    ← Detalle de la donación
    │   │   │
    │   │   ├── reportes/
    │   │   │   ├── page.tsx        ← Menú de reportes disponibles
    │   │   │   ├── por-sexo/
    │   │   │   │   └── page.tsx    ← Reporte de donantes por sexo
    │   │   │   ├── donaciones/
    │   │   │   │   └── page.tsx    ← Reporte de donaciones por período
    │   │   │   └── inventario/
    │   │   │       └── page.tsx    ← Reporte de inventario por grupo sanguíneo
    │   │   │
    │   │   ├── catalogos/          ← Solo accesible para Administrador
    │   │   │   ├── enfermedades/
    │   │   │   │   └── page.tsx
    │   │   │   ├── tipos-donante/
    │   │   │   │   └── page.tsx
    │   │   │   ├── clasificaciones/
    │   │   │   │   └── page.tsx
    │   │   │   └── grupos-sanguineos/
    │   │   │       └── page.tsx
    │   │   │
    │   │   └── admin/              ← Solo accesible para Administrador
    │   │       ├── usuarios/
    │   │       │   ├── page.tsx    ← Listado de usuarios
    │   │       │   └── nuevo/
    │   │       │       └── page.tsx ← Formulario de nuevo usuario
    │   │       └── auditoria/
    │   │           └── page.tsx    ← Log de auditoría
    │   │
    │   └── api/                    ← API Routes del servidor
    │       └── auth/
    │           └── [...nextauth]/
    │               └── route.ts    ← Handler de Auth.js para OAuth 2.0
    │
    ├── components/                 ← Componentes reutilizables
    │   ├── ui/                     ← Componentes base de shadcn (auto-generados)
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── table.tsx
    │   │   ├── dialog.tsx
    │   │   ├── select.tsx
    │   │   ├── badge.tsx
    │   │   └── ...
    │   │
    │   ├── layout/                 ← Componentes de estructura
    │   │   ├── Navbar.tsx          ← Barra de navegación superior
    │   │   ├── Sidebar.tsx         ← Menú lateral con navegación por módulos
    │   │   └── PageHeader.tsx      ← Encabezado de página con título y breadcrumb
    │   │
    │   ├── donantes/               ← Componentes específicos del módulo donantes
    │   │   ├── DonanteForm.tsx     ← Formulario de donante (registro y edición)
    │   │   ├── DonanteTable.tsx    ← Tabla de listado con paginación
    │   │   ├── DonanteSearch.tsx   ← Barra de búsqueda y filtros
    │   │   └── ElegibilidadBadge.tsx ← Indicador visual de elegibilidad
    │   │
    │   ├── donaciones/             ← Componentes específicos del módulo donaciones
    │   │   ├── DonacionForm.tsx    ← Formulario de donación
    │   │   ├── DonacionTable.tsx   ← Tabla de listado con paginación
    │   │   ├── DonacionSearch.tsx  ← Filtros de búsqueda
    │   │   └── EstadoBadge.tsx     ← Badge de estado de la donación
    │   │
    │   └── reportes/               ← Componentes de reportes
    │       ├── ReporteFilters.tsx  ← Formulario de filtros del reporte
    │       └── ReporteTable.tsx    ← Tabla de resultados del reporte
    │
    ├── lib/                        ← Utilidades y configuraciones centrales
    │   ├── prisma.ts               ← Instancia singleton del cliente Prisma
    │   ├── auth.ts                 ← Configuración de Auth.js
    │   ├── audit.ts                ← Función centralizada de registro de auditoría
    │   └── pdf.ts                  ← Utilidades de generación de PDF
    │
    ├── actions/                    ← Server Actions (lógica de negocio del servidor)
    │   ├── donante.actions.ts      ← Crear, editar, desactivar donantes
    │   ├── donacion.actions.ts     ← Crear donaciones, cambiar estado
    │   ├── catalogo.actions.ts     ← CRUD de catálogos
    │   └── usuario.actions.ts     ← CRUD de usuarios
    │
    ├── schemas/                    ← Esquemas de validación Zod
    │   ├── donante.schema.ts       ← Validaciones del formulario de donante
    │   ├── donacion.schema.ts      ← Validaciones del formulario de donación
    │   ├── catalogo.schema.ts      ← Validaciones de catálogos
    │   └── usuario.schema.ts       ← Validaciones de usuarios
    │
    ├── types/                      ← Tipos TypeScript compartidos
    │   ├── donante.types.ts
    │   ├── donacion.types.ts
    │   └── session.types.ts        ← Tipo de la sesión con rol incluido
    │
    └── middleware.ts               ← Middleware de autenticación y control de rutas
```

---

## 2. Descripción de Carpetas Clave

### `prisma/`
Contiene todo lo relacionado con la base de datos. El archivo `schema.prisma` es la fuente de verdad de la estructura de la base de datos. Los cambios a la base de datos se realizan modificando este archivo y ejecutando una migración.

### `src/app/`
Implementa el sistema de rutas de Next.js App Router. Cada carpeta dentro de `app/` es una ruta de la aplicación. Los grupos de rutas entre paréntesis (como `(auth)` y `(dashboard)`) son organizativos y no afectan la URL.

### `src/components/`
Componentes React reutilizables. Se divide en:
- `ui/`: Componentes base de shadcn. Se modifican con precaución.
- `layout/`: Estructura visual de la aplicación (nav, sidebar).
- Subcarpetas por módulo: componentes específicos de cada módulo.

### `src/lib/`
Funciones y configuraciones que se usan en múltiples partes del sistema. Destaca `audit.ts`, que es la función centralizada de auditoría usada en todas las Server Actions de escritura.

### `src/actions/`
Server Actions de Next.js. Contienen la lógica de negocio del servidor: validación con Zod, consultas Prisma y registro de auditoría. Nunca se ejecutan en el cliente.

### `src/schemas/`
Esquemas de validación Zod compartidos entre cliente y servidor. Los mismos esquemas que validan el formulario en el cliente son los que validan los datos en el servidor.

### `src/middleware.ts`
Archivo especial de Next.js que se ejecuta antes de cada solicitud. Verifica la sesión y el rol del usuario. Es la primera línea de defensa de seguridad del sistema.

---

## 3. Variables de Entorno Requeridas

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | Proveedor de base de datos |
| `NEXTAUTH_SECRET` | Clave secreta para firmar tokens de sesión | Generada aleatoriamente (min. 32 chars) |
| `NEXTAUTH_URL` | URL base de la aplicación | URL del dominio de producción |
| `OAUTH_CLIENT_ID` | ID del cliente OAuth 2.0 | Proveedor OAuth configurado |
| `OAUTH_CLIENT_SECRET` | Secreto del cliente OAuth 2.0 | Proveedor OAuth configurado |

> Ninguna de estas variables debe incluirse en el código fuente ni subirse al repositorio. El archivo `.env` está incluido en `.gitignore`.

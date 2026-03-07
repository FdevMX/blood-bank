# Requisitos Generales del Sistema

## 1. Descripción del Proyecto

El sistema **Banco de Sangre** es una aplicación web de uso interno diseñada para que el personal médico y administrativo de un banco de sangre gestione donantes, donaciones, y el inventario de sangre disponible. Centraliza la información, garantiza la trazabilidad médica de cada unidad recolectada y genera reportes para la toma de decisiones.

---

## 2. Objetivos del Sistema

| ID | Objetivo |
|----|----------|
| OBJ-01 | Centralizar y digitalizar el registro de donantes y donaciones en una sola plataforma |
| OBJ-02 | Garantizar la trazabilidad completa de cada unidad de sangre desde la donación hasta su uso |
| OBJ-03 | Controlar el inventario de sangre disponible clasificado por grupo sanguíneo y estado |
| OBJ-04 | Generar reportes médicos y estadísticos para la toma de decisiones |
| OBJ-05 | Implementar un sistema de acceso seguro con control de permisos por rol |
| OBJ-06 | Mantener un registro de auditoría de todas las operaciones realizadas en el sistema |
| OBJ-07 | Configurar catálogos de datos de forma flexible sin necesidad de intervención técnica |

---

## 3. Usuarios del Sistema y Roles

El sistema tiene tres roles. Cada usuario tiene exactamente un rol asignado.

### Rol: Administrador
- Acceso completo a todas las funcionalidades del sistema.
- Puede crear, editar y desactivar usuarios del sistema.
- Puede gestionar todos los catálogos maestros (enfermedades, tipos de donante, clasificaciones, grupos sanguíneos).
- Tiene acceso al log de auditoría completo.
- Puede generar todos los reportes.
- Puede cambiar el estado de cualquier donación.

### Rol: Operador
- Puede registrar y editar donantes.
- Puede registrar nuevas donaciones.
- Puede buscar y consultar donantes y donaciones.
- Puede generar reportes.
- No tiene acceso a gestión de usuarios ni a catálogos maestros.
- No puede cambiar el estado de donaciones a "descartada" o "vencida".

### Rol: Consulta
- Solo lectura: puede visualizar donantes, donaciones y reportes.
- Puede usar los filtros de búsqueda.
- No puede crear, editar ni eliminar ningún registro.

---

## 4. Requisitos Funcionales

| ID | Requisito | Módulo |
|----|-----------|--------|
| RF-01 | El sistema debe requerir autenticación obligatoria para acceder a cualquier página | Autenticación |
| RF-02 | El sistema debe autenticar usuarios mediante OAuth 2.0 | Autenticación |
| RF-03 | El sistema debe controlar el acceso a funcionalidades según el rol del usuario | Autenticación |
| RF-04 | El sistema debe registrar eventos de inicio y cierre de sesión en auditoría | Autenticación |
| RF-05 | El sistema debe permitir registrar donantes con datos personales y médicos completos | Donantes |
| RF-06 | El sistema debe permitir asociar múltiples enfermedades recientes a un donante | Donantes |
| RF-07 | El sistema debe permitir editar datos de un donante existente | Donantes |
| RF-08 | El sistema debe permitir desactivar un donante sin eliminar su historial | Donantes |
| RF-09 | El sistema debe mostrar el historial de donaciones asociadas a cada donante | Donantes |
| RF-10 | El sistema debe indicar si un donante es elegible para donar según las reglas médicas | Donantes |
| RF-11 | El sistema debe registrar cada donación vinculada a un donante existente | Donaciones |
| RF-12 | El sistema debe capturar todos los parámetros médicos al registrar una donación | Donaciones |
| RF-13 | El sistema debe controlar el estado de cada donación (disponible, utilizada, descartada, vencida) | Donaciones |
| RF-14 | El sistema debe permitir buscar donantes por nombre, código, documento o grupo sanguíneo | Búsquedas |
| RF-15 | El sistema debe permitir filtrar donaciones por fecha, grupo sanguíneo, tipo, clasificación y estado | Búsquedas |
| RF-16 | El sistema debe generar un reporte de donantes por sexo | Reportes |
| RF-17 | El sistema debe generar un reporte de donaciones por período de fechas | Reportes |
| RF-18 | El sistema debe generar un reporte de inventario por grupo sanguíneo | Reportes |
| RF-19 | El sistema debe permitir exportar reportes en formato PDF | Reportes |
| RF-20 | El sistema debe permitir al Administrador gestionar los catálogos maestros | Catálogos |
| RF-21 | El sistema debe permitir al Administrador crear, editar y desactivar usuarios | Usuarios |
| RF-22 | El sistema debe registrar en auditoría toda acción de creación, edición o eliminación | Auditoría |
| RF-23 | El sistema debe registrar la dirección IP del usuario en cada acción de auditoría | Auditoría |

---

## 5. Requisitos No Funcionales

### 5.1 Seguridad (Prioritario)
- Toda comunicación con el servidor debe realizarse bajo HTTPS en el entorno de producción.
- Las contraseñas deben almacenarse con función de hash bcrypt, nunca en texto plano.
- Todas las consultas a la base de datos deben realizarse mediante consultas parametrizadas para prevenir inyección SQL.
- Todas las entradas del usuario deben ser validadas tanto en el cliente como en el servidor.
- Las salidas de datos deben ser sanitizadas para prevenir ataques XSS.
- Todos los formularios deben estar protegidos contra ataques CSRF.
- El acceso a cada ruta y acción debe verificar el rol del usuario antes de ejecutarse.
- Las sesiones deben tener tiempo de expiración configurable.
- Los datos sensibles (documentos de identidad, datos médicos) no deben exponerse en URLs.

### 5.2 Rendimiento
- Las páginas principales deben cargar en menos de 3 segundos en una conexión estándar.
- Las búsquedas y consultas deben responder en menos de 2 segundos.
- Los listados deben implementar paginación para evitar cargar registros en exceso.

### 5.3 Usabilidad
- La interfaz debe ser responsive y funcionar correctamente en resoluciones de escritorio y tablet.
- Los mensajes de error deben ser descriptivos y orientadores para el usuario.
- Todas las operaciones exitosas o fallidas deben tener confirmación visual.
- La navegación entre módulos debe ser consistente y accesible.
- Los formularios deben indicar visualmente los campos requeridos.

### 5.4 Disponibilidad y Compatibilidad
- El sistema debe soportar múltiples usuarios simultáneos.
- Debe funcionar correctamente en los navegadores modernos más utilizados (Chrome, Firefox, Edge).

### 5.5 Mantenibilidad
- Los catálogos de datos deben ser configurables desde la interfaz sin modificar el código.
- La estructura del código debe separar claramente la lógica de negocio, el acceso a datos y la presentación.
- Los módulos deben ser independientes entre sí para facilitar cambios futuros.

---

## 6. Restricciones del Sistema

| Restricción | Descripción |
|-------------|-------------|
| Uso interno | El sistema es exclusivamente para personal autorizado del banco de sangre |
| Sin alertas automáticas | No se implementa módulo de notificaciones o alertas automáticas |
| Sin integración externa | No se integra con sistemas de salud gubernamentales ni APIs externas |
| Idioma | La interfaz completa debe estar en español |
| Sin eliminación física | Los registros de donantes, donaciones y usuarios no se eliminan físicamente de la base de datos |
| Despliegue | La aplicación debe desplegarse en un servidor de hosting accesible desde internet |

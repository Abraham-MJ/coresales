# NextCore Mobile - Documentacion de Endpoints API

> Referencia completa para desarrolladores mobile. Todos los endpoints, parametros, respuestas y casos de error.

**Base URL**: `https://api.nextcore.app/api` (produccion) | `http://localhost:3001/api` (desarrollo)

---

## Tabla de Contenidos

1. [Formato de Respuesta](#formato-de-respuesta)
2. [Headers Requeridos](#headers-requeridos)
3. [Convenciones Generales](#convenciones-generales)
4. [Auth](#1-auth)
5. [Sales Reps](#2-sales-reps)
6. [Leads](#3-leads)
7. [Clients](#4-clients)
8. [Contracts](#5-contracts)
9. [Sales](#6-sales)
10. [Datos de Soporte](#7-datos-de-soporte)
11. [Wizard Configs](#8-wizard-configs)
12. [OTP](#9-otp)
13. [File Upload](#10-file-upload)
14. [Flow Automation](#11-flow-automation)
15. [Workspaces](#12-workspaces)

---

## Formato de Respuesta

### Respuesta exitosa

```json
{
  "status": "success",
  "message": "OK",
  "data": { ... }
}
```

### Respuesta de error

```json
{
  "status": "error",
  "message": "Descripcion del error",
  "data": null
}
```

### Respuesta paginada

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Headers Requeridos

```
Authorization: Bearer {token}
Content-Type: application/json
```

> **Excepcion**: `POST /api/s3/upload` usa `Content-Type: multipart/form-data`.

---

## Convenciones Generales

| Regla | Detalle |
|-------|---------|
| `workspace_id` obligatorio | Query param en GET, body en POST/PUT |
| Solo registros activos | Todos los listados filtran `status = 'A'` automaticamente |
| Soft delete | `DELETE` marca `status = 'T'` + `deleted_at = CURRENT_TIMESTAMP` |
| Auto-normalizacion | Backend normaliza nombres a Proper Case, emails a minusculas y sin espacios |
| Status por defecto | No enviar `status: 'A'` en creacion -- el backend lo asigna automaticamente |
| Paginacion por defecto | `page = 1`, `limit = 25`, `sort = created_at`, `order = desc` |
| Token | Formato: `token_{userId}_{timestamp}` |

---

## 1. Auth

### POST /api/auth/login

Autenticacion del usuario. Retorna token y datos basicos.

**Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `email` | string | si* | Email del usuario |
| `username` | string | si* | Nombre de usuario (alternativo a email) |
| `password` | string | si | Contrasena |

> *Se requiere `email` o `username`, al menos uno de los dos.

**Request:**

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "vendedor@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "vendedor@example.com",
    "token": "token_a1b2c3d4-e5f6-7890-abcd-ef1234567890_1709568000000",
    "firstName": "Ana",
    "lastName": "Cardozo",
    "role": "sales_rep",
    "avatar": "/images/avatars/ana.jpg",
    "user_type": "sales_rep",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38"
  }
}
```

**Datos a guardar en almacenamiento local:**

| Key | Valor | Uso |
|-----|-------|-----|
| `token` | `data.token` | Header Authorization en todas las peticiones |
| `workspace_id` | `data.workspace_id` | Param obligatorio en todo endpoint |
| `user_id` | `data.id` | Identificar al usuario |
| `sales_rep_id` | *(obtener de /sales-reps/me)* | Filtros y asignaciones |

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"Email and password are required"` | Faltan campos obligatorios |
| 401 | `"Email not registered"` | El email no existe en el sistema |
| 401 | `"Invalid password"` | Contrasena incorrecta |
| 403 | `"Account deactivated"` | Cuenta con `status = 'T'` o `status = 'I'` |

---

### POST /api/auth/forgot-password

Envia un codigo OTP al email del usuario para recuperar contrasena.

**Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `email` | string | si | Email registrado del usuario |

**Request:**

```json
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "vendedor@example.com"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "data": null
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"Email is required"` | Campo email vacio |
| 400 | `"Invalid email format"` | Formato de email invalido |

---

### POST /api/auth/verify-otp

Verifica que el codigo OTP ingresado sea valido.

**Body:**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `email` | string | si | Email del usuario |
| `otp` | string | si | Codigo OTP recibido por email |

**Request:**

```json
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "vendedor@example.com",
  "otp": "482913"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "verified": true
  }
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"Email and OTP are required"` | Faltan campos |
| 400 | `"Invalid or expired OTP"` | OTP incorrecto o expirado |

---

### POST /api/auth/reset-password

Establece una nueva contrasena usando el OTP verificado.

**Body:**

| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| `email` | string | si | Email registrado |
| `otp` | string | si | OTP previamente verificado |
| `password` | string | si | Min 8 caracteres, al menos 1 letra + 1 numero |

**Request:**

```json
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "vendedor@example.com",
  "otp": "482913",
  "password": "nuevaClave123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Password reset successfully",
  "data": null
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"All fields are required"` | Faltan campos |
| 400 | `"Password must be at least 8 characters with at least 1 letter and 1 number"` | Contrasena debil |
| 400 | `"Invalid or expired OTP"` | OTP invalido |

---

## 2. Sales Reps

### GET /api/sales-reps/me

Obtiene el perfil del vendedor asociado al usuario logueado. **Llamar inmediatamente despues del login.**

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `user_id` | UUID | si | ID del usuario (de login) |

**Request:**

```
GET /api/sales-reps/me?workspace_id=bd7387f4-96e1-4676-ae50-bf9fdfc1da38&user_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "commission_rate": 10,
    "target_leads": 50,
    "target_sales": 100,
    "status": "A",
    "email": "ana@example.com",
    "first_names": "Ana",
    "last_names": "Cardozo",
    "avatar": "/images/avatars/ana.jpg"
  }
}
```

> **Importante**: Guardar `data.id` como `sales_rep_id` en almacenamiento local. Se usa en filtros de leads, ventas, contratos y dashboard.

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"workspace_id and user_id are required"` | Faltan query params |
| 404 | `"Sales rep not found"` | No existe vendedor para ese user_id |

---

### GET /api/sales-reps/me/dashboard

Estadisticas del vendedor para la pantalla de inicio.

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `user_id` | UUID | si | ID del usuario |

**Request:**

```
GET /api/sales-reps/me/dashboard?workspace_id=bd7387f4-96e1-4676-ae50-bf9fdfc1da38&user_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "sales_rep": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "first_names": "Ana",
      "last_names": "Cardozo",
      "avatar": "/images/avatars/ana.jpg",
      "email": "ana@example.com",
      "commission_rate": 10,
      "target_leads": 50,
      "target_sales": 100
    },
    "stats": {
      "total_receivable": 12000000,
      "leads_available": 50,
      "leads_pending": 100,
      "sales_completed": 70,
      "sales_target_percentage": 70,
      "total_sales_amount": 40000000
    },
    "today_tasks_count": 3
  }
}
```

**Mapeo a pantalla de inicio:**

| Elemento UI | Campo |
|-------------|-------|
| Nombre del vendedor | `sales_rep.first_names` + `sales_rep.last_names` |
| Avatar | `sales_rep.avatar` |
| Total por cobrar | `stats.total_receivable` |
| Leads disponibles | `stats.leads_available` |
| Leads pendientes | `stats.leads_pending` |
| Ventas completadas | `stats.sales_completed` |
| % de rendimiento | `stats.sales_target_percentage` |
| Monto total ventas | `stats.total_sales_amount` |
| Tareas de hoy | `today_tasks_count` |

---

## 3. Leads

### GET /api/leads

Lista paginada de leads.

**Query params:**

| Param | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `page` | number | no | `1` | Pagina actual |
| `limit` | number | no | `25` | Registros por pagina |
| `sort` | string | no | `created_at` | Campo de ordenamiento |
| `order` | string | no | `desc` | Direccion: `asc` o `desc` |
| `lead_status_id` | UUID | no | -- | Filtrar por estado del lead |
| `sales_rep_id` | UUID | no | -- | Filtrar por vendedor asignado |
| `service_plan_id` | UUID | no | -- | Filtrar por plan |
| `email` | string | no | -- | Busqueda parcial (ILIKE) |
| `status` | string | no | `A` | `A` = activo, `I` = inactivo, `T` = eliminado |

**Campos de ordenamiento disponibles:**

`id`, `workspace_id`, `first_name`, `last_name`, `email`, `lead_status_id`, `status`, `sales_rep_id`, `service_plan_id`, `created_at`, `updated_at`

**Request:**

```
GET /api/leads?workspace_id=bd7387f4-...&sales_rep_id=f47ac10b-...&page=1&limit=20&sort=created_at&order=desc
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
        "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "juan.perez@gmail.com",
        "phone_code": "+57",
        "phone": "3001234567",
        "lead_status_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
        "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "service_plan_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
        "sale_product_id": null,
        "custom_data": {
          "direccion_instalacion": "Calle 45 #12-30",
          "estrato": "3"
        },
        "status": "A",
        "created_at": "2026-03-04T10:30:00.000Z",
        "updated_at": "2026-03-04T10:30:00.000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 87,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET /api/leads/:id

Obtiene un lead por su ID. Valida que pertenezca al workspace.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Request:**

```
GET /api/leads/c1d2e3f4-a5b6-7890-cdef-123456789012?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "first_name": "Juan",
    "last_name": "Perez",
    "email": "juan.perez@gmail.com",
    "phone_code": "+57",
    "phone": "3001234567",
    "lead_status_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "service_plan_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
    "sale_product_id": null,
    "custom_data": {
      "direccion_instalacion": "Calle 45 #12-30",
      "estrato": "3"
    },
    "status": "A",
    "created_at": "2026-03-04T10:30:00.000Z",
    "updated_at": "2026-03-04T10:30:00.000Z",
    "deleted_at": null
  }
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"workspace_id is required"` | Falta query param |
| 404 | `"Not found"` | ID no existe o pertenece a otro workspace |

---

### POST /api/leads

Crea un nuevo lead.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `first_name` | string | no | -- | Nombre (auto-normalizado a Proper Case) |
| `last_name` | string | no | -- | Apellido (auto-normalizado) |
| `email` | string | no | -- | Email (auto-lowercased, trimmed) |
| `phone_code` | string | no | `"+57"` | Codigo de pais |
| `phone` | string | no | -- | Numero de telefono |
| `lead_status_id` | UUID | no | -- | FK a `lead_statuses` |
| `sales_rep_id` | UUID | no | -- | FK a `sales_reps` (vendedor asignado) |
| `service_plan_id` | UUID | no | -- | FK a `isp_plans` |
| `sale_product_id` | UUID | no | -- | FK a `products` |
| `custom_data` | object | no | `{}` | Campos no-sistema del wizard |

> **Compatibilidad**: `assigned_to` se acepta como alias de `sales_rep_id`. `plan` se acepta como alias de `service_plan_id`.

**Request:**

```json
POST /api/leads
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "first_name": "juan",
  "last_name": "perez garcia",
  "email": "  JUAN.PEREZ@Gmail.com  ",
  "phone_code": "+57",
  "phone": "3001234567",
  "lead_status_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
  "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "service_plan_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
  "custom_data": {
    "direccion_instalacion": "Calle 45 #12-30",
    "estrato": "3",
    "referido_por": "Campana Facebook"
  }
}
```

> **Nota**: El backend normaliza `first_name` a "Juan", `last_name` a "Perez Garcia", y `email` a "juan.perez@gmail.com".

**Response (201):**

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "first_name": "Juan",
    "last_name": "Perez Garcia",
    "email": "juan.perez@gmail.com",
    "phone_code": "+57",
    "phone": "3001234567",
    "lead_status_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "service_plan_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
    "sale_product_id": null,
    "custom_data": {
      "direccion_instalacion": "Calle 45 #12-30",
      "estrato": "3",
      "referido_por": "Campana Facebook"
    },
    "status": "A",
    "created_at": "2026-03-04T14:22:00.000Z",
    "updated_at": "2026-03-04T14:22:00.000Z",
    "deleted_at": null
  }
}
```

---

### PUT /api/leads/:id

Actualiza un lead existente. Acepta los mismos campos que POST.

**Request:**

```json
PUT /api/leads/c1d2e3f4-a5b6-7890-cdef-123456789012
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "lead_status_id": "nuevo-status-uuid",
  "phone": "3009876543"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
    "lead_status_id": "nuevo-status-uuid",
    "phone": "3009876543",
    "updated_at": "2026-03-04T15:00:00.000Z"
  }
}
```

---

### DELETE /api/leads/:id

Soft delete. Marca `status = 'T'` y `deleted_at`.

**Request:**

```
DELETE /api/leads/c1d2e3f4-a5b6-7890-cdef-123456789012?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": null
}
```

---

## 4. Clients

### GET /api/clients

Lista paginada de clientes.

**Query params:**

| Param | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `page` | number | no | `1` | Pagina |
| `limit` | number | no | `25` | Registros por pagina |
| `sort` | string | no | `created_at` | Campo de ordenamiento |
| `order` | string | no | `desc` | Direccion |
| `client_type` | string | no | -- | `persona_natural` o `persona_juridica` |
| `client_status` | string | no | -- | `activo`, `inactivo`, `suspendido`, `cancelado` |
| `document_number` | string | no | -- | Busqueda parcial (ILIKE) |
| `document_type` | string | no | -- | `CC`, `NIT`, `CE`, `TI`, `PP` |
| `email` | string | no | -- | Busqueda parcial (ILIKE) |
| `client_code` | string | no | -- | Busqueda parcial (ILIKE) |
| `lead_id` | UUID | no | -- | Filtrar por lead de origen |
| `status` | string | no | `A` | Status del sistema |

**Campos de ordenamiento disponibles:**

`id`, `workspace_id`, `lead_id`, `client_code`, `client_type`, `first_name`, `last_name`, `business_name`, `document_number`, `email`, `client_status`, `status`, `created_at`, `updated_at`

**Request:**

```
GET /api/clients?workspace_id=bd7387f4-...&client_type=persona_natural&page=1&limit=20
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
        "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
        "client_code": "CLI-0042",
        "client_type": "persona_natural",
        "first_name": "Juan",
        "last_name": "Perez Garcia",
        "business_name": null,
        "document_type": "CC",
        "document_number": "1098765432",
        "email": "juan.perez@gmail.com",
        "phone_code": "+57",
        "phone": "3001234567",
        "client_status": "activo",
        "custom_data": {},
        "status": "A",
        "created_at": "2026-03-04T14:30:00.000Z",
        "updated_at": "2026-03-04T14:30:00.000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 234,
      "totalPages": 12,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET /api/clients/by-document

Busca un cliente por numero de documento. **Esencial para el flujo de venta** (verificar si ya existe antes de crear).

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `document_number` | string | si | Numero de documento a buscar |
| `document_type` | string | no | Tipo: `CC`, `NIT`, `CE`, `TI`, `PP` |

**Request:**

```
GET /api/clients/by-document?workspace_id=bd7387f4-...&document_number=1098765432&document_type=CC
```

**Response cuando EXISTE (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "client_code": "CLI-0042",
    "client_type": "persona_natural",
    "first_name": "Juan",
    "last_name": "Perez Garcia",
    "document_type": "CC",
    "document_number": "1098765432",
    "email": "juan.perez@gmail.com",
    "phone": "3001234567"
  }
}
```

**Response cuando NO EXISTE (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": null
}
```

> **IMPORTANTE**: Cuando no se encuentra el cliente, la respuesta es HTTP 200 con `data: null`, NO un 404. La app mobile debe verificar `data === null` para saber que no existe.

---

### GET /api/clients/:id

Obtiene un cliente por ID.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Request:**

```
GET /api/clients/b2c3d4e5-f6a7-8901-bcde-f12345678901?workspace_id=bd7387f4-...
```

**Response (200):** Misma estructura que un item de la lista.

---

### POST /api/clients

Crea un nuevo cliente.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `lead_id` | UUID | no | -- | Lead de origen (para trazabilidad) |
| `client_code` | string | no | auto `CLI-0001` | Codigo unico del cliente |
| `client_type` | string | no | `"persona_natural"` | `persona_natural` o `persona_juridica` |
| `first_name` | string | no* | -- | Nombre (persona natural, auto-normalizado) |
| `last_name` | string | no* | -- | Apellido (persona natural, auto-normalizado) |
| `business_name` | string | no* | -- | Razon social (persona juridica, auto-normalizado) |
| `document_type` | string | no | -- | `CC`, `NIT`, `CE`, `TI`, `PP` |
| `document_number` | string | no | -- | Numero de documento |
| `email` | string | si | -- | Email (NOT NULL en DB, auto-lowercased) |
| `phone` | string | si | -- | Telefono (NOT NULL en DB) |
| `phone_code` | string | no | `"+57"` | Codigo de pais |
| `client_status` | string | no | `"activo"` | `activo`, `inactivo`, `suspendido`, `cancelado` |
| `custom_data` | object | no | `{}` | Campos adicionales del wizard |

> *Para `persona_natural` usar `first_name` + `last_name`. Para `persona_juridica` usar `business_name`.

**Request:**

```json
POST /api/clients
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
  "client_type": "persona_natural",
  "first_name": "juan",
  "last_name": "perez garcia",
  "document_type": "CC",
  "document_number": "1098765432",
  "email": "juan.perez@gmail.com",
  "phone_code": "+57",
  "phone": "3001234567",
  "custom_data": {
    "direccion": "Calle 45 #12-30",
    "barrio": "Centro"
  }
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
    "client_code": "CLI-0042",
    "client_type": "persona_natural",
    "first_name": "Juan",
    "last_name": "Perez Garcia",
    "business_name": null,
    "document_type": "CC",
    "document_number": "1098765432",
    "email": "juan.perez@gmail.com",
    "phone_code": "+57",
    "phone": "3001234567",
    "client_status": "activo",
    "custom_data": {
      "direccion": "Calle 45 #12-30",
      "barrio": "Centro"
    },
    "status": "A",
    "created_at": "2026-03-04T14:30:00.000Z",
    "updated_at": "2026-03-04T14:30:00.000Z",
    "deleted_at": null
  }
}
```

---

### PUT /api/clients/:id

Actualiza un cliente existente. Acepta los mismos campos que POST.

### PATCH /api/clients/:id

Actualizacion parcial. Mismos campos que PUT.

### DELETE /api/clients/:id

Soft delete: `status = 'T'`, `deleted_at = CURRENT_TIMESTAMP`.

---

## 5. Contracts

### GET /api/contracts

Lista paginada de contratos con datos de relaciones (JOIN).

**Query params:**

| Param | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `page` | number | no | `1` | Pagina |
| `limit` | number | no | `25` | Registros por pagina |
| `sort` | string | no | `created_at` | Campo de ordenamiento |
| `order` | string | no | `desc` | Direccion |
| `client_id` | UUID | no | -- | Filtrar por cliente |
| `quotation_id` | UUID | no | -- | Filtrar por cotizacion |
| `sales_rep_id` | UUID | no | -- | Filtrar por vendedor |
| `sale_product_id` | UUID | no | -- | Filtrar por producto |
| `branch_id` | UUID | no | -- | Filtrar por sucursal |
| `contract_status` | string | no | -- | `activo`, `vencido`, `cancelado`, `pendiente` |
| `code` | string | no | -- | Busqueda parcial (ILIKE) |
| `status` | string | no | `A` | Status del sistema |

**Campos de ordenamiento disponibles:**

`id`, `workspace_id`, `client_id`, `quotation_id`, `sales_rep_id`, `sale_product_id`, `branch_id`, `code`, `contract_date`, `start_date`, `end_date`, `contract_status`, `monthly_amount`, `total_amount`, `status`, `created_at`, `updated_at`

**Request:**

```
GET /api/contracts?workspace_id=bd7387f4-...&sales_rep_id=f47ac10b-...&contract_status=activo&page=1&limit=20
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
        "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
        "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "quotation_id": null,
        "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "sale_product_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
        "branch_id": "11223344-5566-7788-99aa-bbccddeeff00",
        "code": "CT-0078",
        "contract_number": "CTR-0078",
        "contract_date": "2026-03-04",
        "start_date": "2026-03-04",
        "end_date": "2027-03-04",
        "contract_status": "activo",
        "plan": "Internet 100 Mbps",
        "monthly_amount": 89900,
        "total_amount": 1078800,
        "notes": null,
        "installation_address": "Calle 45 #12-30, Barrio Centro",
        "latitude": 7.1193,
        "longitude": -73.1227,
        "has_coverage": 1,
        "custom_data": {
          "signature_url": "https://s3.amazonaws.com/.../firma.png"
        },
        "client_name": "Juan Perez Garcia",
        "client_number": "1098765432",
        "sales_rep_name": "Ana Cardozo",
        "sale_product_name": "Internet Hogar 100 Mbps",
        "status": "A",
        "created_at": "2026-03-04T14:45:00.000Z",
        "updated_at": "2026-03-04T14:45:00.000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 56,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

> **Nota**: Los campos `client_name`, `client_number`, `sales_rep_name` y `sale_product_name` vienen del JOIN. No son columnas del contrato.

---

### GET /api/contracts/:id

Obtiene un contrato por ID con datos de relaciones.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Response (200):** Misma estructura que un item de la lista.

---

### POST /api/contracts

Crea un nuevo contrato.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `client_id` | UUID | si | -- | FK al cliente |
| `service_plan_id` | UUID | no | -- | FK al plan ISP |
| `sales_rep_id` | UUID | no | -- | FK al vendedor |
| `sale_product_id` | UUID | no | -- | FK al producto |
| `branch_id` | UUID | no | -- | FK a la sucursal |
| `code` | string | no | auto `CT-xxxx` | Codigo del contrato |
| `contract_number` | string | no | auto `CTR-0001` | Numero secuencial |
| `contract_date` | string | no | hoy | Fecha del contrato `YYYY-MM-DD` |
| `start_date` | string | no | hoy | Fecha de inicio `YYYY-MM-DD` |
| `end_date` | string | no | -- | Fecha de fin `YYYY-MM-DD` |
| `contract_status` | string | no | `"activo"` | `activo`, `vencido`, `cancelado`, `pendiente` |
| `plan` | string | no | -- | Nombre del plan (texto libre) |
| `monthly_amount` | number | no | `0` | Monto mensual |
| `total_amount` | number | no | `0` | Monto total |
| `notes` | string | no | -- | Notas adicionales |
| `installation_address` | string | no | -- | Direccion de instalacion |
| `latitude` | number | no | -- | Latitud GPS |
| `longitude` | number | no | -- | Longitud GPS |
| `has_coverage` | number | no | `0` | Tiene cobertura: `0` = no, `1` = si |
| `custom_data` | object | no | `{}` | Campos adicionales (incluir `signature_url` aqui) |

> **EFECTO SECUNDARIO IMPORTANTE**: Al crear un contrato con `client_id`, el backend crea automaticamente un registro de instalacion pendiente en la tabla `installations` con `installation_status: 'pending'`. No se necesita una llamada API separada.

**Request:**

```json
POST /api/contracts
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "service_plan_id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
  "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "branch_id": "11223344-5566-7788-99aa-bbccddeeff00",
  "contract_date": "2026-03-04",
  "start_date": "2026-03-04",
  "end_date": "2027-03-04",
  "contract_status": "activo",
  "plan": "Internet 100 Mbps",
  "monthly_amount": 89900,
  "total_amount": 1078800,
  "installation_address": "Calle 45 #12-30, Barrio Centro",
  "latitude": 7.1193,
  "longitude": -73.1227,
  "has_coverage": 1,
  "custom_data": {
    "signature_url": "https://s3.amazonaws.com/.../firma.png"
  }
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "code": "CT-0078",
    "contract_number": "CTR-0078",
    "contract_date": "2026-03-04",
    "start_date": "2026-03-04",
    "end_date": "2027-03-04",
    "contract_status": "activo",
    "monthly_amount": 89900,
    "total_amount": 1078800,
    "installation_address": "Calle 45 #12-30, Barrio Centro",
    "latitude": 7.1193,
    "longitude": -73.1227,
    "has_coverage": 1,
    "status": "A",
    "created_at": "2026-03-04T14:45:00.000Z",
    "updated_at": "2026-03-04T14:45:00.000Z"
  }
}
```

---

### PUT /api/contracts/:id

Actualiza un contrato existente. Acepta los mismos campos que POST.

### PATCH /api/contracts/:id

Actualizacion parcial. Mismos campos que PUT.

### DELETE /api/contracts/:id

Soft delete: `status = 'T'`, `deleted_at = CURRENT_TIMESTAMP`.

---

## 6. Sales

### GET /api/sales

Lista paginada de ventas con datos de relaciones (JOIN).

**Query params:**

| Param | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `page` | number | no | `1` | Pagina |
| `limit` | number | no | `25` | Registros por pagina |
| `sort` | string | no | `created_at` | Campo de ordenamiento |
| `order` | string | no | `desc` | Direccion |
| `client_id` | UUID | no | -- | Filtrar por cliente |
| `lead_id` | UUID | no | -- | Filtrar por lead |
| `sales_rep_id` | UUID | no | -- | Filtrar por vendedor |
| `sale_status` | string | no | -- | `pendiente`, `completada`, `cancelada`, `reembolsada` |
| `code` | string | no | -- | Busqueda parcial (ILIKE) |
| `status` | string | no | `A` | Status del sistema |

**Request:**

```
GET /api/sales?workspace_id=bd7387f4-...&sales_rep_id=f47ac10b-...&sale_status=pendiente&page=1&limit=20
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
        "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
        "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
        "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "code": "VTA-0156",
        "sale_number": "VTA-0156",
        "sale_date": "2026-03-04",
        "document_type": "nota_venta",
        "sale_status": "pendiente",
        "subtotal": 150000,
        "tax_amount": 28500,
        "total_amount": 178500,
        "commission": 15000,
        "notes": null,
        "client_name": "Juan Perez Garcia",
        "client_email": "juan.perez@gmail.com",
        "client_phone": "3001234567",
        "client_address": "Calle 45 #12-30",
        "sales_rep_name": "Ana Cardozo",
        "items": [
          {
            "id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
            "product_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
            "name": "Internet Hogar 100 Mbps",
            "type": "service",
            "quantity": 1,
            "unit_price": 89900,
            "tax_rate": 19,
            "tax_type": "iva",
            "discount_amount": 0,
            "description": "Plan mensual internet hogar",
            "seller_commission": 10000,
            "technician_commission": 5000
          },
          {
            "id": "a7b8c9d0-e1f2-3456-7890-abcdef012345",
            "product_id": "b2c3d4e5-6789-0123-bcde-f12345678901",
            "name": "Instalacion",
            "type": "service",
            "quantity": 1,
            "unit_price": 60100,
            "tax_rate": 19,
            "tax_type": "iva",
            "discount_amount": 0,
            "description": "Instalacion de servicio",
            "seller_commission": 5000,
            "technician_commission": 15000
          }
        ],
        "status": "A",
        "created_at": "2026-03-04T15:00:00.000Z",
        "updated_at": "2026-03-04T15:00:00.000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET /api/sales/:id

Obtiene una venta por ID con el array completo de `items`.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Response (200):** Misma estructura que un item de la lista.

---

### POST /api/sales

Crea una nueva venta con sus items.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `workspace_id` | UUID | si | -- | ID del workspace |
| `client_id` | UUID | no | -- | FK al cliente |
| `lead_id` | UUID | no | -- | FK al lead |
| `sales_rep_id` | UUID | no | -- | FK al vendedor |
| `code` | string | no | auto `VTA-xxxx` | Codigo de la venta |
| `sale_number` | string | no | auto `VTA-0001` | Numero secuencial |
| `sale_date` | string | no | hoy | Fecha de venta `YYYY-MM-DD` |
| `document_type` | string | no | `"nota_venta"` | Tipo de documento |
| `sale_status` | string | no | `"pendiente"` | Ver tabla de mapeo abajo |
| `subtotal` | number | no | auto-calculado | Subtotal (calculado de items si no se envia) |
| `tax_amount` | number | no | `0` | Monto de impuestos |
| `total_amount` | number | no | -- | Monto total |
| `commission` | number | no | auto-calculado | Comision (ver nota abajo) |
| `notes` | string | no | -- | Notas |
| `items` | array | no | `[]` | Array de items de la venta |
| `payments` | array | no | `[]` | Array de pagos: `{ method, amount }` |

**Mapeo de valores de `sale_status` (EN a ES):**

| Valor enviado (EN) | Valor almacenado (ES) |
|---------------------|----------------------|
| `pending` | `pendiente` |
| `completed` | `completada` |
| `cancelled` | `cancelada` |
| `refunded` | `reembolsada` |

> Se pueden enviar directamente en espanol tambien.

**Estructura de cada item en `items`:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `product_id` | UUID | no | -- | FK al producto |
| `name` | string | no | -- | Nombre del item |
| `type` | string | no | `"product"` | `product` o `service` |
| `quantity` | number | no | `1` | Cantidad |
| `unit_price` | number | no | -- | Precio unitario |
| `tax_rate` | number | no | `0` | Porcentaje de impuesto |
| `tax_type` | string | no | `"iva"` | Tipo de impuesto |
| `discount_amount` | number | no | `0` | Monto de descuento |
| `description` | string | no | -- | Descripcion |
| `seller_commission` | number | no | `0` | Comision del vendedor |
| `technician_commission` | number | no | `0` | Comision del tecnico |

> **Auto-calculo de comision**: Si no se envia `commission`, el backend calcula automaticamente sumando `products.sales_commission` (para items tipo `product`) y `products.installation_commission` (para items tipo `service` o items con nombre que contenga "instalacion").

> **Auto-resolucion de seller_id**: El backend obtiene automaticamente el `user_id` de la tabla `sales_reps` usando el `sales_rep_id` proporcionado. No es necesario enviar `seller_id`.

**Request:**

```json
POST /api/sales
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
  "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "sale_date": "2026-03-04",
  "sale_status": "pending",
  "total_amount": 178500,
  "tax_amount": 28500,
  "items": [
    {
      "product_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
      "name": "Internet Hogar 100 Mbps",
      "type": "service",
      "quantity": 1,
      "unit_price": 89900,
      "tax_rate": 19,
      "tax_type": "iva"
    },
    {
      "product_id": "b2c3d4e5-6789-0123-bcde-f12345678901",
      "name": "Instalacion",
      "type": "service",
      "quantity": 1,
      "unit_price": 60100,
      "tax_rate": 19,
      "tax_type": "iva"
    }
  ],
  "payments": [
    {
      "method": "cash",
      "amount": 178500
    }
  ]
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "client_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "lead_id": "c1d2e3f4-a5b6-7890-cdef-123456789012",
    "sales_rep_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "code": "VTA-0156",
    "sale_number": "VTA-0156",
    "sale_date": "2026-03-04",
    "document_type": "nota_venta",
    "sale_status": "pendiente",
    "subtotal": 150000,
    "tax_amount": 28500,
    "total_amount": 178500,
    "commission": 15000,
    "notes": null,
    "items": [
      {
        "id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
        "product_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
        "name": "Internet Hogar 100 Mbps",
        "type": "service",
        "quantity": 1,
        "unit_price": 89900,
        "tax_rate": 19,
        "tax_type": "iva",
        "discount_amount": 0,
        "seller_commission": 10000,
        "technician_commission": 5000
      },
      {
        "id": "a7b8c9d0-e1f2-3456-7890-abcdef012345",
        "product_id": "b2c3d4e5-6789-0123-bcde-f12345678901",
        "name": "Instalacion",
        "type": "service",
        "quantity": 1,
        "unit_price": 60100,
        "tax_rate": 19,
        "tax_type": "iva",
        "discount_amount": 0,
        "seller_commission": 5000,
        "technician_commission": 15000
      }
    ],
    "status": "A",
    "created_at": "2026-03-04T15:00:00.000Z",
    "updated_at": "2026-03-04T15:00:00.000Z"
  }
}
```

---

### PUT /api/sales/:id

Actualiza una venta. Si se incluye `items`, los items anteriores se **eliminan** y se insertan los nuevos.

> **CUIDADO**: El array `items` en PUT es destructivo. Si se envia, reemplaza completamente los items anteriores. Si no se necesita modificar items, no incluir el campo.

**Request:**

```json
PUT /api/sales/e5f6a7b8-c9d0-1234-5678-90abcdef0123
Content-Type: application/json

{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "sale_status": "completed",
  "notes": "Pago recibido en efectivo"
}
```

---

### DELETE /api/sales/:id

Soft delete: `status = 'T'`, `deleted_at = CURRENT_TIMESTAMP`.

---

## 7. Datos de Soporte

Endpoints de referencia para llenar selects, dropdowns y filtros.

### GET /api/lead-statuses

Estados posibles de un lead. Ordenados por `order_index`.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Request:**

```
GET /api/lead-statuses?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "name": "Nuevo",
      "color": "#3B82F6",
      "order_index": 1,
      "is_default": 1,
      "is_completion": 0,
      "is_cancellation": 0,
      "status": "A"
    },
    {
      "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "name": "En Contacto",
      "color": "#F59E0B",
      "order_index": 2,
      "is_default": 0,
      "is_completion": 0,
      "is_cancellation": 0,
      "status": "A"
    },
    {
      "id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "name": "Ganado",
      "color": "#10B981",
      "order_index": 5,
      "is_default": 0,
      "is_completion": 1,
      "is_cancellation": 0,
      "status": "A"
    }
  ]
}
```

**Campos utiles para la app:**

| Campo | Uso |
|-------|-----|
| `id` | Valor a enviar como `lead_status_id` |
| `name` | Texto a mostrar en el dropdown |
| `color` | Color del badge/chip en la UI |
| `is_default` | `1` = estado por defecto para leads nuevos |
| `is_completion` | `1` = estado de "ganado/convertido" |
| `is_cancellation` | `1` = estado de "perdido/cancelado" |

---

### GET /api/isp-plans

Planes de servicio ISP disponibles.

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `type` | string | no | Filtrar: `internet`, `tv`, `telefonia`, `combo`, `otro` |
| `code` | string | no | Filtrar por codigo |
| `name` | string | no | Filtrar por nombre |

**Request:**

```
GET /api/isp-plans?workspace_id=bd7387f4-...&type=internet
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "code": "INT-100",
      "name": "Internet 100 Mbps",
      "description": "Plan internet hogar 100 Mbps simetrico",
      "type": "internet",
      "speed_down": 100,
      "speed_up": 100,
      "price": 89900,
      "installation_price": 60000,
      "tax_id": null,
      "status": "A"
    }
  ]
}
```

---

### GET /api/products

Catalogo de productos.

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `category_id` | UUID | no | Filtrar por categoria |
| `brand` | string | no | Filtrar por marca |
| `code` | string | no | Filtrar por codigo |
| `name` | string | no | Filtrar por nombre |
| `requires_serial` | boolean | no | Solo productos que requieren serial |

**Request:**

```
GET /api/products?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "code": "ONT-HG8145X6",
      "name": "ONT Huawei HG8145X6",
      "description": "Router ONT Huawei WiFi 6",
      "category": "Equipos de Red",
      "category_id": "cat-uuid",
      "brand": "Huawei",
      "model": "HG8145X6",
      "unit": "unidad",
      "cost": 120000,
      "price": 180000,
      "min_stock": 10,
      "max_stock": 100,
      "barcode": "7891234567890",
      "sku": "HW-HG8145X6",
      "product_status": "disponible",
      "sales_commission": 10000,
      "installation_commission": 15000,
      "requires_serial": true,
      "requires_mac": true,
      "status": "A"
    }
  ]
}
```

**Campos de comision:**

| Campo | Descripcion |
|-------|-------------|
| `sales_commission` | Comision del vendedor por unidad vendida |
| `installation_commission` | Comision del tecnico por instalacion |

---

### GET /api/branches

Lista de sucursales.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Request:**

```
GET /api/branches?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "id": "11223344-5566-7788-99aa-bbccddeeff00",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "name": "Sucursal Centro",
      "address": "Calle 36 #18-40",
      "status": "A"
    }
  ]
}
```

---

### GET /api/zones

Lista de zonas. **Dependen de la sucursal seleccionada** -- recargar al cambiar sucursal.

**Query params:**

| Param | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `workspace_id` | UUID | si | ID del workspace |
| `branch_id` | UUID | no | Filtrar zonas por sucursal |

**Request:**

```
GET /api/zones?workspace_id=bd7387f4-...&branch_id=11223344-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": [
    {
      "id": "aabbccdd-eeff-1122-3344-556677889900",
      "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
      "branch_id": "11223344-5566-7788-99aa-bbccddeeff00",
      "name": "Zona Norte",
      "status": "A"
    }
  ]
}
```

> **Importante para mobile**: Al seleccionar una sucursal (branch) en un formulario, se deben recargar las zonas filtrando por `branch_id`.

---

## 8. Wizard Configs

### GET /api/wizard-configs/default

Obtiene la configuracion del formulario dinamico para una entidad. **Los formularios de lead, cliente y contrato se generan dinamicamente** segun la configuracion del workspace.

**Query params:**

| Param | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| `workspace_id` | UUID | si | ID del workspace |
| `entity_type` | string | si | `lead`, `client`, `contract` |

**Request:**

```
GET /api/wizard-configs/default?workspace_id=bd7387f4-...&entity_type=lead
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "config-uuid",
    "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "entity_type": "lead",
    "name": "Formulario de Lead",
    "steps": [
      {
        "id": "step-1-uuid",
        "name": "Informacion Basica",
        "order": 1,
        "fields": [
          {
            "id": "field-1-uuid",
            "name": "Nombre",
            "label": "Nombre",
            "field_type": "text",
            "is_required": true,
            "is_system_field": true,
            "system_field_mapping": "first_name",
            "options": null,
            "data_source": null,
            "data_source_filters": null,
            "placeholder": "Ingrese el nombre",
            "default_value": null,
            "validations": null,
            "hidden_conditions": null,
            "order": 1
          },
          {
            "id": "field-2-uuid",
            "name": "Plan de Servicio",
            "label": "Plan",
            "field_type": "select",
            "is_required": false,
            "is_system_field": true,
            "system_field_mapping": "service_plan_id",
            "options": null,
            "data_source": "isp_plans",
            "data_source_filters": { "type": "internet" },
            "placeholder": "Seleccione un plan",
            "default_value": null,
            "validations": null,
            "hidden_conditions": null,
            "order": 5
          },
          {
            "id": "field-3-uuid",
            "name": "Direccion de Instalacion",
            "label": "Direccion",
            "field_type": "text",
            "is_required": false,
            "is_system_field": false,
            "system_field_mapping": null,
            "options": null,
            "data_source": null,
            "data_source_filters": null,
            "placeholder": "Calle, numero, barrio",
            "default_value": null,
            "validations": null,
            "hidden_conditions": null,
            "order": 8
          }
        ]
      }
    ]
  }
}
```

**Tipos de campo (`field_type`) y su componente mobile:**

| `field_type` | Componente Mobile | Teclado |
|--------------|-------------------|---------|
| `text` | TextInput | default |
| `number` | TextInput | numerico |
| `phone` | TextInput | telefono |
| `email` | TextInput | email |
| `select` | Dropdown / Picker | -- |
| `multiselect` | Multi-select Picker | -- |
| `date` | DatePicker | -- |
| `photo` | Camera / Image Picker | -- |
| `location` | Mapa / GPS Picker | -- |
| `textarea` | Multi-line TextInput | default |

**Logica de campos sistema vs custom:**

```
if (field.is_system_field === true) {
    // El valor va directamente a la columna de la tabla
    // Usar field.system_field_mapping como key del body
    body[field.system_field_mapping] = valor;
} else {
    // El valor va dentro de custom_data
    body.custom_data[field.name] = valor;
}
```

**Logica de data sources para campos select:**

| Valor de `data_source` | Endpoint a consultar | Campo `id` para el value | Campo para el label |
|-------------------------|---------------------|--------------------------|---------------------|
| `isp_plans` | `GET /api/isp-plans?workspace_id=X` | `id` | `name` |
| `products` | `GET /api/products?workspace_id=X` | `id` | `name` |
| `sales_reps` | `GET /api/sales-reps?workspace_id=X&with_user_info=true` | `id` | `first_names` + `last_names` |
| `lead_statuses` | `GET /api/lead-statuses?workspace_id=X` | `id` | `name` |
| `branches` | `GET /api/branches?workspace_id=X` | `id` | `name` |
| `zones` | `GET /api/zones?workspace_id=X&branch_id=Y` | `id` | `name` |
| `clients` | `GET /api/clients?workspace_id=X` | `id` | `first_name` + `last_name` |

> **Nota**: Si `data_source` es `null` pero `options` tiene valor, usar `options` como array de opciones estaticas (ej: `["Masculino", "Femenino"]`).

> **Nota**: Si `data_source_filters` tiene valor (ej: `{ "type": "internet" }`), agregar como query params al endpoint del data source.

**Flujo de campos tipo `photo`:**

1. Abrir camara o galeria
2. Subir imagen: `POST /api/s3/upload` (ver seccion 10)
3. Obtener la URL de respuesta
4. Guardar la URL como valor del campo en `custom_data`

**Flujo de campos tipo `location`:**

1. Obtener coordenadas GPS del dispositivo
2. Almacenar como `{ latitude, longitude, address }` en el campo

---

## 9. OTP

### POST /api/otp/generate

Genera y envia un codigo OTP por email. Usado para firmar contratos y verificar instalaciones.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `email` | string | si | -- | Email donde enviar el OTP |
| `purpose` | string | si | -- | `contract_sign`, `installation_verify`, `general` |
| `user_name` | string | no | `"Usuario"` | Nombre para personalizar el email |
| `workspace_id` | UUID | no | -- | ID del workspace |
| `reference_id` | UUID | no | -- | ID de la entidad relacionada (contrato, instalacion) |
| `reference_type` | string | no | -- | Tipo de entidad (`contract`, `installation`) |

**Request:**

```json
POST /api/otp/generate
Content-Type: application/json

{
  "email": "juan.perez@gmail.com",
  "purpose": "contract_sign",
  "user_name": "Juan Perez",
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "reference_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
  "reference_type": "contract"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "expires_at": "2026-03-04T15:30:00.000Z"
  }
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"Email and purpose are required"` | Faltan campos obligatorios |
| 400 | `"Invalid purpose"` | Valor de purpose no valido |
| 400 | `"Invalid email format"` | Formato de email invalido |

---

### POST /api/otp/verify

Verifica un codigo OTP.

**Body:**

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `email` | string | si | -- | Email del OTP |
| `otp` | string | si | -- | Codigo OTP |
| `purpose` | string | si | -- | Debe coincidir con el de generacion |
| `reference_id` | UUID | no | -- | ID de la entidad relacionada |
| `mark_used` | boolean | no | `false` | Marcar OTP como usado tras verificar |

**Request:**

```json
POST /api/otp/verify
Content-Type: application/json

{
  "email": "juan.perez@gmail.com",
  "otp": "482913",
  "purpose": "contract_sign",
  "reference_id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
  "mark_used": true
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "verified": true,
    "token_id": "otp-record-uuid"
  }
}
```

**Errores:**

| Codigo | Mensaje | Causa |
|--------|---------|-------|
| 400 | `"Email, OTP and purpose are required"` | Faltan campos |
| 400 | `"Invalid or expired OTP"` | Codigo incorrecto o expirado |

---

## 10. File Upload

### POST /api/s3/upload

Sube un archivo a S3. Usado para fotos del wizard y firmas digitales.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

> **IMPORTANTE**: Este es el unico endpoint que NO usa `application/json`. Usar `multipart/form-data`.

**Body (form-data):**

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `file` | File | si | Archivo a subir (imagen, PDF, etc.) |
| `workspace_id` | string | si | ID del workspace |

**Request (ejemplo con cURL):**

```bash
curl -X POST https://api.nextcore.app/api/s3/upload \
  -H "Authorization: Bearer token_xxx" \
  -F "file=@firma.png" \
  -F "workspace_id=bd7387f4-96e1-4676-ae50-bf9fdfc1da38"
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "url": "https://nextcore-uploads.s3.amazonaws.com/bd7387f4/contracts/firma-1709568000000.png",
    "key": "bd7387f4/contracts/firma-1709568000000.png",
    "bucket": "nextcore-uploads",
    "originalName": "firma.png",
    "size": 45678,
    "contentType": "image/png"
  }
}
```

**Uso tipico - subir firma de contrato:**

```
1. Capturar firma en canvas del mobile
2. Convertir a PNG/JPEG
3. POST /api/s3/upload con el archivo
4. Guardar data.url
5. Incluir en custom_data del contrato:
   { "signature_url": "https://s3..." }
```

---

## 11. Flow Automation

### GET /api/flow-automation/lead/client

Obtiene el mapeo de campos de lead a cliente. Usado para pre-llenar el formulario de cliente al convertir un lead.

**Query params:**

| Param | Tipo | Requerido |
|-------|------|-----------|
| `workspace_id` | UUID | si |

**Request:**

```
GET /api/flow-automation/lead/client?workspace_id=bd7387f4-...
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "mappings": [
      { "source_field": "first_name", "target_field": "first_name" },
      { "source_field": "last_name", "target_field": "last_name" },
      { "source_field": "email", "target_field": "email" },
      { "source_field": "phone", "target_field": "phone" },
      { "source_field": "phone_code", "target_field": "phone_code" }
    ]
  }
}
```

**Logica de pre-llenado:**

```javascript
// lead = datos del lead actual
// mappings = data.mappings del response
const clientData = {};

mappings.forEach(m => {
  if (lead[m.source_field]) {
    clientData[m.target_field] = lead[m.source_field];
  }
});

// clientData ahora tiene los campos pre-llenados para el form de cliente
```

---

## 12. Workspaces

### GET /api/workspaces/:id

Obtiene informacion del workspace. Util para nombre de empresa, logo y moneda.

**Request:**

```
GET /api/workspaces/bd7387f4-96e1-4676-ae50-bf9fdfc1da38
```

**Alternativa por query param:**

```
GET /api/workspaces?workspace_id=bd7387f4-96e1-4676-ae50-bf9fdfc1da38
```

**Response (200):**

```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
    "name": "ISP Colombia SAS",
    "logo": "/images/logos/isp-colombia.png",
    "currency_code": "COP",
    "settings": {
      "timezone": "America/Bogota",
      "language": "es"
    }
  }
}
```

> **Uso de `currency_code`**: Usar este valor para formatear todos los montos monetarios en la app. Ejemplo: `COP` = pesos colombianos, `USD` = dolares, `EUR` = euros.

---

## Apendice A: Flujo Completo de Venta (Secuencia de APIs)

```
1. Login
   POST /api/auth/login
   GET /api/sales-reps/me

2. Dashboard
   GET /api/sales-reps/me/dashboard

3. Crear Lead
   GET /api/wizard-configs/default?entity_type=lead
   GET /api/lead-statuses  (para dropdown)
   GET /api/isp-plans      (para dropdown)
   POST /api/leads

4. Buscar/Crear Cliente
   GET /api/clients/by-document?document_number=XXX
   Si no existe:
     GET /api/flow-automation/lead/client  (pre-llenar)
     GET /api/wizard-configs/default?entity_type=client
     POST /api/clients

5. Crear Contrato
   GET /api/wizard-configs/default?entity_type=contract
   GET /api/branches        (para dropdown)
   GET /api/zones           (para dropdown, filtrado por branch)
   POST /api/s3/upload      (firma)
   POST /api/otp/generate   (verificacion)
   POST /api/otp/verify     (confirmar OTP)
   POST /api/contracts

6. Crear Venta
   GET /api/products        (para items)
   POST /api/sales

7. Consultar Historial
   GET /api/leads?sales_rep_id=X
   GET /api/sales?sales_rep_id=X
   GET /api/contracts?sales_rep_id=X
```

---

## Apendice B: Codigos HTTP de Referencia

| Codigo | Significado | Cuando ocurre |
|--------|-------------|---------------|
| 200 | OK | GET exitoso, PUT/PATCH/DELETE exitoso |
| 201 | Created | POST exitoso (nuevo recurso creado) |
| 400 | Bad Request | Faltan campos requeridos, validacion fallida |
| 401 | Unauthorized | Token invalido o expirado, credenciales incorrectas |
| 403 | Forbidden | Cuenta desactivada, sin permisos |
| 404 | Not Found | Recurso no existe o pertenece a otro workspace |
| 500 | Internal Server Error | Error del servidor |

---

## Apendice C: Valores Enum de Referencia

### Status del sistema (`status`)

| Valor | Significado |
|-------|-------------|
| `A` | Activo |
| `I` | Inactivo |
| `T` | Eliminado (trash / soft delete) |

### Tipos de cliente (`client_type`)

| Valor | Significado |
|-------|-------------|
| `persona_natural` | Persona natural |
| `persona_juridica` | Persona juridica / empresa |

### Tipos de documento (`document_type`)

| Valor | Significado |
|-------|-------------|
| `CC` | Cedula de Ciudadania |
| `NIT` | Numero de Identificacion Tributaria |
| `CE` | Cedula de Extranjeria |
| `TI` | Tarjeta de Identidad |
| `PP` | Pasaporte |

### Estado del cliente (`client_status`)

| Valor |
|-------|
| `activo` |
| `inactivo` |
| `suspendido` |
| `cancelado` |

### Estado del contrato (`contract_status`)

| Valor |
|-------|
| `activo` |
| `vencido` |
| `cancelado` |
| `pendiente` |

### Estado de venta (`sale_status`)

| Valor ES | Valor EN (aceptado) |
|----------|---------------------|
| `pendiente` | `pending` |
| `completada` | `completed` |
| `cancelada` | `cancelled` |
| `reembolsada` | `refunded` |

### Tipo de plan ISP (`type`)

| Valor |
|-------|
| `internet` |
| `tv` |
| `telefonia` |
| `combo` |
| `otro` |

### Proposito de OTP (`purpose`)

| Valor | Uso |
|-------|-----|
| `contract_sign` | Firma digital de contrato |
| `installation_verify` | Verificacion de instalacion |
| `general` | Proposito general |

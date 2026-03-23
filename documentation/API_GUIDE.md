# NextCore Mobile - Guia de Integracion API para Vendedores

> **Documentacion completa**: Ver tambien [ENDPOINTS.md](./ENDPOINTS.md), [SALES_FLOW.md](./SALES_FLOW.md) y [DATA_MODELS.md](./DATA_MODELS.md).

## Configuracion Base

| Variable | Descripcion |
|----------|-------------|
| `base_url` | `http://localhost:3001/api` (dev) / `https://nextcorenow.com/api` (prod) |
| `token` | Token de autenticacion (obtenido en login) |
| `workspace_id` | ID del workspace activo |
| `user_id` | ID del usuario logueado |
| `sales_rep_id` | ID del vendedor (obtenido de `/sales-reps/me`) |

### Headers requeridos
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Formato de respuesta estandar
```json
{ "status": "success", "message": "OK", "data": { ... } }
```

### Formato de error
```json
{ "status": "error", "message": "Descripcion del error", "data": null }
```

### Formato paginado
```json
{
  "status": "success",
  "message": "OK",
  "data": {
    "items": [...],
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

> **Nota sobre Auth**: El token tiene formato `token_{userId}_{timestamp}`. El servidor NO valida criptograficamente el token -- el `workspace_id` como query param es el mecanismo de scoping.

---

## Sistema de Status

### Status Unificado (sistema)
Todas las tablas tienen `status CHAR(1)`:
- `'A'` = Activo (registro visible y funcional)
- `'I'` = Inactivo (deshabilitado pero no eliminado)
- `'T'` = Trash (soft-deleted, con `deleted_at` timestamp)

Los endpoints de listado filtran `WHERE status = 'A'` automaticamente. **NO enviar `status` en creacion** -- el backend lo pone en `'A'` por defecto.

### Status de Dominio (negocio)
Cada entidad tiene su propio campo de status de negocio:

| Entidad | Campo | Valores |
|---------|-------|---------|
| Lead | `lead_status_id` | UUID (FK a tabla `lead_statuses`, configurable por workspace) |
| Client | `client_status` | `activo`, `inactivo`, `suspendido`, `cancelado` |
| Contract | `contract_status` | `activo`, `vencido`, `cancelado`, `pendiente` |
| Sale | `sale_status` | `pendiente`, `completada`, `cancelada`, `reembolsada` |

> **IMPORTANTE**: Los leads NO usan `status: "new"`. Usan `lead_status_id` que es un UUID FK a la tabla `lead_statuses`. Obtener los estados disponibles con `GET /api/lead-statuses?workspace_id=X`.

### Soft Delete
`DELETE` en cualquier endpoint NO elimina fisicamente el registro. Marca `status = 'T'` y `deleted_at = CURRENT_TIMESTAMP`.

---

## Manejo de Errores

| HTTP Status | Significado | Ejemplo |
|-------------|-------------|---------|
| `200` | OK | Operacion exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Falta `workspace_id`, campo requerido vacio, formato invalido |
| `401` | Unauthorized | Email no registrado, password invalido |
| `403` | Forbidden | Cuenta desactivada (`status = 'T'`) |
| `404` | Not Found | Recurso no existe o pertenece a otro workspace |
| `500` | Server Error | Error interno del servidor |

### Validacion de passwords
- Minimo 8 caracteres
- Al menos 1 letra
- Al menos 1 numero

---

## Flujo Completo de la App

> **Guia detallada paso a paso**: Ver [SALES_FLOW.md](./SALES_FLOW.md)

### 1. Login Flow

```
POST /api/auth/login
Body: { "email": "vendedor@example.com", "password": "Pass1234" }
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": "user-uuid",
    "token": "token_uuid_1707600000000",
    "workspace_id": "ws-uuid",
    "email": "vendedor@example.com",
    "firstName": "Ana",
    "lastName": "Cardozo",
    "role": "Propietario",
    "user_type": "sales_rep",
    "avatar": "/images/avatar.jpg"
  }
}
```

Despues del login, obtener el perfil de vendedor:

```
GET /api/sales-reps/me?workspace_id={workspace_id}&user_id={user_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "sales-rep-uuid",
    "user_id": "user-uuid",
    "workspace_id": "ws-uuid",
    "commission_rate": 10,
    "target_leads": 50,
    "target_sales": 100,
    "status": "A",
    "email": "ana@example.com",
    "first_names": "Ana",
    "last_names": "Cardozo",
    "avatar": "/images/avatar.jpg"
  }
}
```

**Guardar en storage local:** `token`, `workspace_id`, `user_id`, `sales_rep_id`

### Otros endpoints de auth:
- `POST /api/auth/forgot-password` -- Body: `{ "email": "..." }`
- `POST /api/auth/verify-otp` -- Body: `{ "email": "...", "otp": "123456" }`
- `POST /api/auth/reset-password` -- Body: `{ "email": "...", "otp": "...", "password": "NuevaPass1" }`

---

### 2. Home Screen (Inicio)

#### Dashboard Stats
```
GET /api/sales-reps/me/dashboard?workspace_id={workspace_id}&user_id={user_id}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sales_rep": {
      "id": "sr-uuid",
      "first_names": "Ana",
      "last_names": "Cardozo",
      "avatar": "/images/avatar.jpg",
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

**Mapeo a pantalla Inicio:**
| Dato en pantalla | Campo en response |
|---|---|
| "Total por cobrar" | `stats.total_receivable` |
| "50 Disponibles" | `stats.leads_available` |
| "100 Pendientes" | `stats.leads_pending` |
| "70% Rendimiento" | `stats.sales_target_percentage` |
| "Ventas completadas" | `stats.sales_completed` |

#### Tareas de hoy
```
GET /api/tasks?workspace_id={workspace_id}&assigned_to={sales_rep_id}&task_status=pending&limit=5
```

#### Actividad reciente
```
GET /api/activity-feed?workspace_id={workspace_id}&sales_rep_id={sales_rep_id}&limit=10
```

---

### 3. Formularios Dinamicos (Wizard Config)

**CONCEPTO CLAVE**: Los formularios de Lead, Cliente y Contrato NO son estaticos. Se generan dinamicamente basados en la configuracion del workspace (`wizard_configs`). Cada workspace puede tener campos distintos.

#### Obtener configuracion del formulario:
```
GET /api/wizard-configs/default?workspace_id={workspace_id}&entity_type=lead
GET /api/wizard-configs/default?workspace_id={workspace_id}&entity_type=client
GET /api/wizard-configs/default?workspace_id={workspace_id}&entity_type=contract
```

#### Estructura de un campo:
```json
{
  "id": "field-uuid",
  "name": "first_name",
  "label": "Primer Nombre",
  "field_type": "text",
  "is_required": true,
  "is_system_field": true,
  "system_field_mapping": "first_name",
  "order": 1,
  "options": null,
  "data_source": null,
  "data_source_filters": null,
  "placeholder": "Ingrese el nombre",
  "default_value": null,
  "validations": null,
  "hidden_conditions": null,
  "default_country_code": null
}
```

#### Tipos de campo (`field_type`):
| Tipo | Componente Mobile |
|------|-------------------|
| `text` | TextInput |
| `number` | TextInput (numeric keyboard) |
| `phone` | TextInput (phone keyboard) |
| `email` | TextInput (email keyboard) |
| `select` | Dropdown/Picker |
| `multiselect` | Multi-select Picker |
| `date` | DatePicker |
| `photo` | Camera/Image picker -> Upload a S3 |
| `location` | Map/GPS picker |
| `textarea` | Multi-line TextInput |

#### Campos de sistema vs Custom:
- **`is_system_field: true`** + `system_field_mapping: "first_name"` -> El valor va directamente a la columna `first_name` de la tabla
- **`is_system_field: false`** -> El valor va dentro del JSON `custom_data`

**Ejemplo de body para crear lead:**
```json
{
  "workspace_id": "ws-uuid",
  "sales_rep_id": "sr-uuid",
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@example.com",
  "phone_code": "+57",
  "phone": "3001234567",
  "lead_status_id": "uuid-del-primer-estado",
  "custom_data": {
    "direccion_instalacion": "Calle 123",
    "estrato": "3",
    "referido_por": "Campana Facebook"
  }
}
```

> **IMPORTANTE**: Usar `lead_status_id` (UUID del estado), NO `status: "new"`. Obtener el primer estado de `GET /api/lead-statuses?workspace_id=X`.

#### Data Sources para campos select/multiselect:

Cuando un campo tiene `data_source`, se debe hacer un GET al endpoint correspondiente para obtener las opciones:

| `data_source` value | Endpoint |
|---|---|
| `isp_plans` | `GET /api/isp-plans?workspace_id=X` |
| `products` | `GET /api/products?workspace_id=X` |
| `sales_reps` | `GET /api/sales-reps?workspace_id=X&with_user_info=true` |
| `lead_statuses` | `GET /api/lead-statuses?workspace_id=X` |
| `branches` | `GET /api/branches?workspace_id=X` |
| `zones` | `GET /api/zones?workspace_id=X&branch_id=Y` |
| `clients` | `GET /api/clients?workspace_id=X` |

> **Nota:** Si `data_source` es `null` pero `options` tiene valor, usar `options` como array de opciones estaticas (ej: `["Masculino", "Femenino"]`).

---

### 4. Crear Lead

1. Obtener config: `GET /api/wizard-configs/default?entity_type=lead&workspace_id=X`
2. Cargar data sources de campos select
3. Renderizar formulario dinamicamente
4. Enviar:

```
POST /api/leads
Body: {
  "workspace_id": "...",
  "sales_rep_id": "...",
  "first_name": "...",
  "last_name": "...",
  "email": "...",
  "phone_code": "+57",
  "phone": "...",
  "lead_status_id": "uuid-del-estado",
  "custom_data": { ... }
}
```

---

### 5. Flujo de Venta

#### Paso 1: Ubicacion
Capturar direccion + coordenadas GPS del dispositivo.

#### Paso 2: Cliente
1. Buscar si el cliente ya existe:
   ```
   GET /api/clients/by-document?workspace_id=X&document_number=1234567890&document_type=CC
   ```
   > **NOTA**: Si no existe, retorna HTTP 200 con `data: null` (NO es un 404).
2. Si no existe, obtener config y crear:
   ```
   GET /api/wizard-configs/default?entity_type=client&workspace_id=X
   POST /api/clients
   ```
3. **Flow Automation** -- Pre-llenar campos del lead al cliente:
   ```
   GET /api/flow-automation/lead/client?workspace_id=X
   ```
   Retorna mapeo de campos: `{ "mappings": [{ "source_field": "first_name", "target_field": "first_name" }, ...] }`

#### Paso 3: Contrato
1. Obtener config: `GET /api/wizard-configs/default?entity_type=contract&workspace_id=X`
2. Capturar firma -> subir como imagen:
   ```
   POST /api/s3/upload
   Content-Type: multipart/form-data
   Body: file=<archivo_firma.png>, workspace_id=X
   ```
   Response: `{ "data": { "url": "https://..." } }`
3. OTP (opcional): `POST /api/otp/generate` + `POST /api/otp/verify`
4. Crear contrato con URL de firma:
   ```
   POST /api/contracts
   Body: {
     "workspace_id": "...",
     "client_id": "...",
     "service_plan_id": "...",
     "sales_rep_id": "...",
     "start_date": "2026-03-04",
     "monthly_amount": 89000,
     "installation_address": "Calle 123",
     "latitude": 4.6097,
     "longitude": -74.0817,
     "has_coverage": 1,
     "custom_data": { "signature_url": "https://..." }
   }
   ```
   > Auto-genera `contract_number` y `code`. Auto-crea instalacion pendiente.

#### Paso 4: Venta
```
POST /api/sales
Body: {
  "workspace_id": "...",
  "client_id": "...",
  "sales_rep_id": "...",
  "total_amount": 150000,
  "items": [
    {
      "product_id": "...",
      "name": "Plan Internet 100Mbps",
      "type": "service",
      "quantity": 1,
      "unit_price": 89000
    },
    {
      "product_id": "...",
      "name": "Router WiFi",
      "type": "product",
      "quantity": 1,
      "unit_price": 61000
    }
  ]
}
```

> Auto-genera `sale_number` y `code`. Auto-calcula `commission`. Auto-resuelve `seller_id` desde `sales_rep_id`. Status `"pending"` se mapea a `"pendiente"` en DB.

#### Paso 5: Exito
Mostrar resumen de la venta creada.

---

### 6. Buscar

#### Tab "Leads"
```
GET /api/leads?workspace_id=X&sales_rep_id=Y&page=1&limit=20&sort=created_at&order=desc
```

Filtros disponibles: `lead_status_id`, `sales_rep_id`, `service_plan_id`, `email` (ILIKE)

#### Tab "Ventas"
```
GET /api/sales?workspace_id=X&sales_rep_id=Y&page=1&limit=20&sort=sale_date&order=desc
```

#### Tab "Clientes"
```
GET /api/clients?workspace_id=X&page=1&limit=20&sort=created_at&order=desc
```

Filtros disponibles: `client_type`, `client_status`, `document_number` (ILIKE), `email` (ILIKE), `client_code` (ILIKE)

---

### 7. Workspace Info
```
GET /api/workspaces/{workspace_id}
```

Util para obtener: nombre de la empresa, logo, `currency_code` (para formateo de moneda), tema de colores.

---

## Paginacion

| Parametro | Default | Descripcion |
|-----------|---------|-------------|
| `page` | `1` | Pagina actual |
| `limit` | `25` | Items por pagina (max 10000) |
| `sort` | Depende del endpoint | Campo para ordenar |
| `order` | `desc` | Direccion: `asc` o `desc` |

Los filtros se envian como query params adicionales. Ej: `?workspace_id=X&lead_status_id=Y&email=juan`

---

## Notas Importantes

1. **`workspace_id` siempre requerido** -- Enviar como query param en todos los GET y en el body de todos los POST/PUT.

2. **Paginacion** -- Parametros: `page` (default 1), `limit` (default 25), `sort` (campo), `order` (asc/desc).

3. **Soft deletes** -- Los registros no se eliminan fisicamente. `DELETE` marca `status = 'T'` y `deleted_at = CURRENT_TIMESTAMP`.

4. **`custom_data`** -- Campo JSONB flexible. Los campos del wizard que no son `is_system_field` van aqui.

5. **Subida de archivos** -- Usar `POST /api/s3/upload` con `multipart/form-data`. El campo del archivo se llama `file`.

6. **Moneda** -- Obtener `currency_code` del workspace para formatear valores monetarios correctamente.

7. **Fotos del wizard** -- Campos tipo `photo`: capturar imagen -> subir a S3 -> guardar URL retornada en `custom_data.{field_key}`.

8. **Zonas dependen de Branch** -- Al seleccionar una sucursal (branch), recargar zonas: `GET /api/zones?workspace_id=X&branch_id=Y`.

9. **Nombres auto-normalizados** -- El backend convierte nombres a formato propio (primera letra mayuscula) y emails a minusculas automaticamente.

10. **Client by-document retorna null** -- `GET /api/clients/by-document` retorna HTTP 200 con `data: null` cuando no encuentra cliente, NO un 404.

---

## Documentacion Relacionada

| Documento | Contenido |
|-----------|-----------|
| [ENDPOINTS.md](./ENDPOINTS.md) | Referencia completa de ~34 endpoints con request/response |
| [SALES_FLOW.md](./SALES_FLOW.md) | Guia paso a paso del flujo Lead -> Cliente -> Contrato -> Venta |
| [DATA_MODELS.md](./DATA_MODELS.md) | Interfaces de datos, tipos, enums y validaciones |
| [POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json) | Coleccion Postman lista para probar |

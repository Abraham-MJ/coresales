# Flujo Completo de Ventas — App Movil de Vendedores

Guia paso a paso para el desarrollador mobile. Cubre desde el login hasta el registro de la venta, con todos los endpoints, payloads y comportamientos automaticos del backend.

> **Prerequisito**: Leer primero `API_GUIDE.md` para entender headers, formato de respuesta y formularios dinamicos (wizard configs).

---

## Diagrama General

```
+─────────────────────────────────────────────────────────────────────+
|                        FLUJO DE VENTAS                              |
+─────────────────────────────────────────────────────────────────────+

  [1] LOGIN                [2] CACHE DATOS
   POST /auth/login    ──>  GET /lead-statuses
   GET /sales-reps/me       GET /isp-plans
         |                  GET /products
         v                  GET /branches
  [3] DASHBOARD             GET /wizard-configs (x3)
   GET /sales-reps/         GET /workspaces/{id}
       me/dashboard              |
         |                       v
         +──────────+────────────+
                    |
         +──────────v──────────+
         |   ACCIONES DEL      |
         |    VENDEDOR         |
         +──────────+──────────+
                    |
      +─────────────+─────────────+
      |             |             |
      v             v             v
  [4] LEADS    [5] CLIENTE   [8] BUSQUEDA
   POST /leads  GET /clients/   GET /leads
   PUT /leads     by-document   GET /sales
   GET /leads   POST /clients   GET /clients
      |             |
      v             v
  [6] CONTRATO              [7] VENTA
   POST /s3/upload           POST /sales
   POST /otp/generate
   POST /otp/verify
   POST /contracts ──> auto-crea instalacion pendiente
```

```
Flujo tipico de una venta nueva:

  Login ──> Dashboard ──> Crear Lead ──> Buscar/Crear Cliente
                                              |
                                              v
                          Registrar Venta <── Crear Contrato
                                              (firma + OTP)
```

---

## Paso 1: Login y Setup Inicial

### 1.1 Autenticacion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "vendedor@example.com",
  "password": "Pass1234"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user-uuid",
    "token": "token_uuid_timestamp",
    "workspace_id": "ws-uuid",
    "firstName": "Ana",
    "lastName": "Cardozo",
    "email": "vendedor@example.com",
    "role": "sales_rep",
    "user_type": "sales_rep"
  }
}
```

### 1.2 Obtener perfil de vendedor

```http
GET /api/sales-reps/me?workspace_id={ws-uuid}&user_id={user-uuid}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "sr-uuid",
    "user_id": "user-uuid",
    "workspace_id": "ws-uuid",
    "commission_rate": 10,
    "target_leads": 50,
    "target_sales": 100,
    "email": "ana@example.com",
    "first_names": "Ana",
    "last_names": "Cardozo",
    "avatar": "/images/avatar.jpg"
  }
}
```

### 1.3 Almacenamiento local obligatorio

Guardar estos 4 valores en almacenamiento persistente del dispositivo:

| Key | Origen | Uso |
|-----|--------|-----|
| `token` | Login response | Header `Authorization: Bearer {token}` |
| `workspace_id` | Login response | Query param / body en TODOS los requests |
| `user_id` | Login response | Identificar usuario actual |
| `sales_rep_id` | `/sales-reps/me` response `.data.id` | Asociar leads, ventas, contratos |

### 1.4 Otros endpoints de auth (referencia)

```
POST /api/auth/forgot-password    — Body: { "email": "..." }
POST /api/auth/verify-otp         — Body: { "email": "...", "otp": "123456" }
POST /api/auth/reset-password     — Body: { "email": "...", "otp": "...", "newPassword": "..." }
```

---

## Paso 2: Cargar Datos de Referencia (Cache)

Al primer inicio (o cuando el cache expire), descargar estos datos de referencia. Cambian poco y se usan en formularios y selects a lo largo de toda la app.

### Llamadas de cache inicial

| Endpoint | Descripcion | Uso principal |
|----------|-------------|---------------|
| `GET /api/lead-statuses?workspace_id=X` | Estados del pipeline de leads | Select de estado al crear/mover leads |
| `GET /api/isp-plans?workspace_id=X` | Planes de servicio con precios | Select en lead y contrato |
| `GET /api/products?workspace_id=X` | Productos disponibles | Items de la venta |
| `GET /api/branches?workspace_id=X` | Sucursales | Select en contrato |
| `GET /api/wizard-configs/default?workspace_id=X&entity_type=lead` | Config formulario de lead | Renderizar formulario dinamico |
| `GET /api/wizard-configs/default?workspace_id=X&entity_type=client` | Config formulario de cliente | Renderizar formulario dinamico |
| `GET /api/wizard-configs/default?workspace_id=X&entity_type=contract` | Config formulario de contrato | Renderizar formulario dinamico |
| `GET /api/workspaces/{workspace_id}` | Info del workspace | Nombre empresa, logo, `currency_code` |

### Estrategia de cache recomendada

```
- Guardar en SQLite local o key-value store
- TTL sugerido: 24 horas
- Invalidar manualmente con pull-to-refresh en pantallas relevantes
- currency_code del workspace es critico para formatear montos
```

---

## Paso 3: Dashboard del Vendedor

### 3.1 Obtener estadisticas

```http
GET /api/sales-reps/me/dashboard?workspace_id={ws-uuid}&user_id={user-uuid}
Authorization: Bearer {token}
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

### 3.2 Mapeo a UI

| Elemento en pantalla | Campo del response |
|----------------------|--------------------|
| Nombre del vendedor | `sales_rep.first_names` + `sales_rep.last_names` |
| Avatar | `sales_rep.avatar` |
| "Total por cobrar" | `stats.total_receivable` (formatear con `currency_code`) |
| "Leads disponibles" | `stats.leads_available` |
| "Leads pendientes" | `stats.leads_pending` |
| "Ventas completadas" | `stats.sales_completed` |
| "% Rendimiento" | `stats.sales_target_percentage` |
| "Tareas de hoy" | `today_tasks_count` |

### 3.3 Endpoints complementarios del dashboard

```http
GET /api/tasks?workspace_id={ws}&assigned_to={sales_rep_id}&status=pending&limit=5
GET /api/activity-feed?workspace_id={ws}&sales_rep_id={sales_rep_id}&limit=10
```

---

## Paso 4: Gestion de Leads

### 4.1 Obtener configuracion del formulario

```http
GET /api/wizard-configs/default?workspace_id={ws-uuid}&entity_type=lead
Authorization: Bearer {token}
```

La respuesta contiene un array `steps`, cada uno con un array `fields`. Renderizar el formulario dinamicamente segun esta configuracion.

**Estructura de un campo:**
```json
{
  "id": "field-uuid",
  "field_name": "Nombre",
  "field_key": "first_name",
  "field_type": "text",
  "is_required": true,
  "is_system_field": true,
  "system_field_mapping": "first_name",
  "step": 1,
  "order": 1,
  "options": null,
  "data_source": null,
  "placeholder": "Ingrese el nombre"
}
```

**Regla critica para armar el body:**
- Si `is_system_field: true` --> el valor va como campo de primer nivel en el body (ej: `"first_name": "Juan"`)
- Si `is_system_field: false` --> el valor va dentro de `custom_data` usando `field_key` como key

### 4.2 Resolver opciones de campos select

Para campos con `field_type: "select"` o `"multiselect"`:

| Valor de `data_source` | Endpoint para opciones |
|-------------------------|----------------------|
| `isp_plans` | `GET /api/isp-plans?workspace_id=X` |
| `products` | `GET /api/products?workspace_id=X` |
| `sales_reps` | `GET /api/sales-reps?workspace_id=X&with_user_info=true` |
| `lead_statuses` | `GET /api/lead-statuses?workspace_id=X` |
| `branches` | `GET /api/branches?workspace_id=X` |
| `zones` | `GET /api/zones?workspace_id=X&branch_id=Y` |
| `null` (con `options` presente) | Usar el array `options` directamente |

### 4.3 Crear lead

```http
POST /api/leads
Content-Type: application/json
Authorization: Bearer {token}

{
  "workspace_id": "ws-uuid",
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@example.com",
  "phone_code": "+57",
  "phone": "3001234567",
  "lead_status_id": "uuid-del-primer-estado",
  "sales_rep_id": "sr-uuid",
  "service_plan_id": "plan-uuid",
  "custom_data": {
    "address": "Calle 123 #45-67",
    "stratum": 3,
    "housing_type": "apartment",
    "source": "referido"
  }
}
```

> **IMPORTANTE**: Usar `lead_status_id` (UUID) y NO `status: "new"`. Obtener el UUID del primer estado desde `GET /api/lead-statuses`. El primer registro retornado suele ser el estado inicial del pipeline.

> **No enviar `status: 'A'`** en el body. El backend asigna `status = 'A'` (activo) automaticamente.

### 4.4 Listar leads del vendedor

```http
GET /api/leads?workspace_id={ws}&sales_rep_id={sr-uuid}&page=1&limit=20&sort=created_at&order=desc
Authorization: Bearer {token}
```

**Parametros de paginacion:**

| Parametro | Default | Descripcion |
|-----------|---------|-------------|
| `page` | 1 | Pagina actual |
| `limit` | 20 | Registros por pagina |
| `sort` | `created_at` | Campo para ordenar |
| `order` | `desc` | Direccion (`asc` / `desc`) |
| `search` | - | Busca en first_name, last_name, email, phone |

**Response paginada:**
```json
{
  "status": 200,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.5 Actualizar lead (mover en pipeline)

```http
PUT /api/leads/{lead-uuid}
Content-Type: application/json
Authorization: Bearer {token}

{
  "lead_status_id": "nuevo-estado-uuid"
}
```

Solo enviar los campos que cambian. El backend hace merge con los datos existentes.

---

## Paso 5: Buscar o Crear Cliente

### 5.1 Verificar si el cliente ya existe

Antes de crear un cliente nuevo, buscar por numero de documento:

```http
GET /api/clients/by-document?workspace_id={ws}&document_number=1234567890&document_type=CC
Authorization: Bearer {token}
```

**Si el cliente EXISTE:**
```json
{
  "status": "success",
  "data": {
    "id": "client-uuid",
    "first_name": "Juan",
    "last_name": "Perez",
    "document_type": "CC",
    "document_number": "1234567890",
    "client_code": "CLI-0042",
    ...
  }
}
```
--> Usar el `id` del cliente existente para el contrato y la venta.

**Si el cliente NO existe:**
```json
{
  "status": "success",
  "message": "No client found with that document",
  "data": null
}
```

> **ATENCION**: Cuando no se encuentra cliente, la respuesta es **HTTP 200** con `data: null`. **NO es un 404**. El mobile debe verificar `response.data === null`, no el status code HTTP.

### 5.2 Pre-llenar formulario desde lead (Flow Automation)

Si el cliente viene de un lead existente, obtener el mapeo de campos para pre-llenar el formulario:

```http
GET /api/flow-automation/lead/client?workspace_id={ws}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
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

Usar este mapeo para copiar valores del objeto lead al formulario de cliente.

### 5.3 Obtener configuracion del formulario de cliente

```http
GET /api/wizard-configs/default?workspace_id={ws}&entity_type=client
Authorization: Bearer {token}
```

Mismo formato que wizard de lead (ver Paso 4.1). Renderizar dinamicamente.

### 5.4 Crear cliente

```http
POST /api/clients
Content-Type: application/json
Authorization: Bearer {token}

{
  "workspace_id": "ws-uuid",
  "lead_id": "lead-uuid-si-viene-de-lead",
  "client_type": "persona_natural",
  "first_name": "Juan",
  "last_name": "Perez",
  "document_type": "CC",
  "document_number": "1234567890",
  "email": "juan@example.com",
  "phone_code": "+57",
  "phone": "3001234567",
  "client_status": "activo",
  "custom_data": {
    "address": "Calle 123",
    "birth_date": "1990-05-15",
    "stratum": 3
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "client-uuid",
    "client_code": "CLI-0001",
    "first_name": "Juan",
    "last_name": "Perez",
    ...
  }
}
```

**Comportamientos automaticos del backend:**
- `client_code` se genera automaticamente (ej: `CLI-0001`) si no se envia
- Nombres se normalizan a formato propio (primera letra mayuscula)
- Emails se convierten a minusculas
- `status` se asigna como `'A'` (activo) por defecto

> **Nota**: El campo `lead_id` es opcional. Enviarlo solo si el cliente viene de un lead, para mantener la trazabilidad lead --> cliente.

---

## Paso 6: Crear Contrato

### 6.1 Obtener configuracion del formulario

```http
GET /api/wizard-configs/default?workspace_id={ws}&entity_type=contract
Authorization: Bearer {token}
```

### 6.2 Subir firma (si el formulario lo requiere)

Capturar la firma del cliente como imagen (canvas de firma en la app) y subirla a S3:

```http
POST /api/s3/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

--boundary
Content-Disposition: form-data; name="file"; filename="firma.png"
Content-Type: image/png

<datos binarios de la imagen>
--boundary
Content-Disposition: form-data; name="workspace_id"

ws-uuid
--boundary--
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "url": "https://s3.amazonaws.com/bucket/firma.png"
  }
}
```

Guardar `data.url` para incluirla en `custom_data.signature_url` del contrato.

### 6.3 Verificacion OTP (opcional pero recomendado)

Para validar la identidad del cliente al firmar el contrato:

**Paso A: Generar OTP**
```http
POST /api/otp/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "email": "juan@example.com",
  "purpose": "contract_sign",
  "user_name": "Juan Perez"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "expires_at": "2026-03-04T15:30:00Z"
  }
}
```

El sistema envia un codigo de 6 digitos al email del cliente.

**Paso B: Verificar OTP**
```http
POST /api/otp/verify
Content-Type: application/json
Authorization: Bearer {token}

{
  "email": "juan@example.com",
  "otp": "123456",
  "purpose": "contract_sign",
  "mark_used": true
}
```

**Response (exito):**
```json
{
  "status": "success",
  "data": {
    "verified": true
  }
}
```

**Response (fallo):**
```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

> **Valores validos para `purpose`**: `contract_sign`, `installation_verify`, `general`. Para reset de password usar las rutas de `/api/auth/` (ver Paso 1.4).

### 6.4 Crear contrato

```http
POST /api/contracts
Content-Type: application/json
Authorization: Bearer {token}

{
  "workspace_id": "ws-uuid",
  "client_id": "client-uuid",
  "service_plan_id": "plan-uuid",
  "sales_rep_id": "sr-uuid",
  "sale_product_id": "product-uuid",
  "branch_id": "branch-uuid",
  "start_date": "2026-03-04",
  "monthly_amount": 89000,
  "total_amount": 1068000,
  "installation_address": "Calle 123 #45-67, Bogota",
  "latitude": 4.6097,
  "longitude": -74.0817,
  "has_coverage": 1,
  "custom_data": {
    "signature_url": "https://s3.amazonaws.com/bucket/firma.png"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "contract-uuid",
    "contract_number": "CTR-0001",
    "code": "CT-xxxx",
    "contract_status": "activo",
    "contract_date": "2026-03-04",
    ...
  }
}
```

**Comportamientos automaticos del backend:**
- `contract_number` se genera automaticamente (ej: `CTR-0001`)
- `code` se genera automaticamente (ej: `CT-xxxx`)
- `contract_date` se asigna como la fecha de hoy si no se envia
- `contract_status` se asigna como `"activo"` por defecto
- **Auto-crea una instalacion pendiente** en la tabla `installations` con `installation_status: 'pending'`. No se necesita una llamada API separada para crear la instalacion.

---

## Paso 7: Registrar Venta

### 7.1 Crear venta

```http
POST /api/sales
Content-Type: application/json
Authorization: Bearer {token}

{
  "workspace_id": "ws-uuid",
  "client_id": "client-uuid",
  "sales_rep_id": "sr-uuid",
  "sale_date": "2026-03-04",
  "total_amount": 239000,
  "status": "pending",
  "items": [
    {
      "product_id": "plan-uuid",
      "name": "Plan Internet 100Mbps",
      "type": "service",
      "quantity": 1,
      "unit_price": 89000
    },
    {
      "product_id": "router-uuid",
      "name": "Router WiFi 6",
      "type": "product",
      "quantity": 1,
      "unit_price": 150000
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "sale-uuid",
    "sale_number": "VTA-0001",
    "code": "VTA-xxxx",
    "document_type": "nota_venta",
    "sale_status": "pendiente",
    ...
  }
}
```

**Comportamientos automaticos del backend:**
- `sale_number` se genera automaticamente (ej: `VTA-0001`)
- `code` se genera automaticamente (ej: `VTA-xxxx`)
- `seller_id` se resuelve automaticamente: el backend busca el `user_id` asociado al `sales_rep_id` en la tabla `sales_reps`
- `commission` se calcula automaticamente sumando:
  - `products.sales_commission` para items de tipo `product`
  - `products.installation_commission` para items de tipo `service`
- `document_type` se asigna como `"nota_venta"` por defecto

### 7.2 Mapeo de estados de venta

El mobile puede enviar status en ingles. El backend mapea automaticamente a espanol:

| Valor enviado (ingles) | Valor almacenado (espanol) |
|------------------------|---------------------------|
| `pending` | `pendiente` |
| `completed` | `completada` |
| `cancelled` | `cancelada` |
| `refunded` | `reembolsada` |

> **ATENCION**: Los filtros en listados (`GET /api/sales?status=...`) usan los valores en **espanol** del DB. Si se quiere filtrar ventas pendientes: `?status=pendiente`, NO `?status=pending`.

---

## Paso 8: Busqueda y Listados

### Tab "Leads"

```http
GET /api/leads?workspace_id={ws}&sales_rep_id={sr-uuid}&page=1&limit=20&sort=created_at&order=desc
Authorization: Bearer {token}
```

Filtros adicionales: `search`, `lead_status_id`

### Tab "Ventas"

```http
GET /api/sales?workspace_id={ws}&sales_rep_id={sr-uuid}&page=1&limit=20&sort=sale_date&order=desc
Authorization: Bearer {token}
```

### Tab "Clientes"

```http
GET /api/clients?workspace_id={ws}&page=1&limit=20&sort=created_at&order=desc
Authorization: Bearer {token}
```

### Paginacion universal

Todas las respuestas paginadas siguen el mismo formato:

```json
{
  "status": 200,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

Usar `pagination.hasNext` para decidir si cargar mas paginas (infinite scroll o boton "cargar mas").

---

## Gotchas y Notas Importantes

### 1. Sale status mapping (ingles vs espanol)

Mobile puede enviar status en ingles (`pending`, `completed`, `cancelled`, `refunded`). El backend mapea automaticamente a espanol (`pendiente`, `completada`, `cancelada`, `reembolsada`). **PERO** los filtros en listados usan los valores en espanol del DB.

```
Crear venta:   { "status": "pending" }        <-- ingles OK
Filtrar lista:  ?status=pendiente              <-- espanol obligatorio
```

### 2. Contract auto-crea instalacion

Al crear un contrato con `client_id`, el backend crea automaticamente un registro en la tabla `installations` con `installation_status: 'pending'`. **No se necesita una llamada API separada.**

### 3. Commission auto-calculada

Si no se envia `commission` en la venta, el backend la calcula automaticamente:
- Items tipo `product` --> suma `products.sales_commission`
- Items tipo `service` (o con nombre "instalacion") --> suma `products.installation_commission`

### 4. Client by-document retorna null, NO 404

```
GET /api/clients/by-document?document_number=999
--> HTTP 200  { "data": null }     <-- NO es 404!
```

Verificar `response.data === null` en vez de capturar errores HTTP.

### 5. Zonas dependen de branch_id

Al seleccionar una sucursal en un formulario, recargar las zonas disponibles:

```
GET /api/zones?workspace_id=X&branch_id=Y
```

### 6. OTP: solo 3 purposes validos

| Purpose | Uso |
|---------|-----|
| `contract_sign` | Firma de contrato |
| `installation_verify` | Verificacion de instalacion |
| `general` | Proposito general |

Para reset de password, usar las rutas de `/api/auth/` (ver Paso 1.4). NO usar el endpoint `/api/otp/`.

### 7. seller_id es auto-resolved

Mobile envia `sales_rep_id` en la venta. El backend busca el `user_id` asociado en la tabla `sales_reps` y lo guarda como `seller_id`. No enviar `seller_id` manualmente.

### 8. Nombres auto-normalizados

El backend convierte automaticamente:
- Nombres --> Primera letra mayuscula (ej: "juan" --> "Juan")
- Emails --> Minusculas (ej: "Juan@Example.COM" --> "juan@example.com")

No es necesario normalizar en mobile.

### 9. client_code auto-generado

Al crear un cliente sin enviar `client_code`, el backend genera uno automaticamente con formato `CLI-XXXX` (ej: `CLI-0001`). Lo mismo aplica para `contract_number` (`CTR-XXXX`) y `sale_number` (`VTA-XXXX`).

### 10. Campos de sistema vs custom_data en wizard

Al procesar los campos del wizard config para armar el body del POST:

```
Si field.is_system_field === true:
    body[field.system_field_mapping] = valor

Si field.is_system_field === false:
    body.custom_data[field.field_key] = valor
```

**Ejemplo:**
```json
// Wizard retorna estos campos:
// { field_key: "first_name", is_system_field: true, system_field_mapping: "first_name" }
// { field_key: "estrato", is_system_field: false }

// Body resultante:
{
  "workspace_id": "ws-uuid",
  "first_name": "Juan",         // <-- campo de sistema, primer nivel
  "custom_data": {
    "estrato": 3                 // <-- campo custom, dentro de custom_data
  }
}
```

### 11. workspace_id siempre requerido

**Todos** los requests deben incluir `workspace_id`:
- En `GET` --> como query parameter: `?workspace_id=X`
- En `POST` / `PUT` --> dentro del body JSON: `{ "workspace_id": "X", ... }`

### 12. Subida de archivos (fotos, firma)

Para campos tipo `photo` en el wizard o para la firma del contrato:

```
1. Capturar imagen (camara o galeria)
2. POST /api/s3/upload  (multipart/form-data, campo "file")
3. Recibir URL de S3 en response
4. Guardar URL en el campo correspondiente del body (custom_data o campo de sistema)
```

### 13. No enviar status en creacion

Al crear leads, clientes o contratos, **no enviar** `status: 'A'` en el body. El backend asigna el status activo por defecto. Enviar `status` podria causar conflictos.

La excepcion es `POST /api/sales` donde si se puede enviar `status: "pending"` para indicar el estado inicial de la venta.

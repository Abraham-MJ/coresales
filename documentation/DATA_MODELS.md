# Modelos de Datos — API Mobile Sales App

Referencia completa de los modelos de datos expuestos por la API REST para la app mobile de vendedores.

> **Convenciones de este documento:**
> - `required` = obligatorio en creación
> - `auto` = generado por el backend, no enviar
> - `default: X` = valor por defecto si no se envía
> - Todos los `id` son UUID v4
> - Todas las fechas son strings ISO 8601 (e.g. `2026-03-04T15:30:00.000Z`)

---

## Tabla de Contenidos

1. [LeadApi](#1-leadapi)
2. [ClientApi](#2-clientapi)
3. [ContractApi](#3-contractapi)
4. [SaleApi](#4-saleapi)
5. [SaleItemApi](#5-saleitemapi)
6. [IspPlanApi](#6-ispplanapi)
7. [ProductApi](#7-productapi)
8. [LeadStatusApi](#8-leadstatusapi)
9. [SalesRepApi](#9-salesrepapi)
10. [WizardConfig](#10-wizardconfig)
11. [OTP Types](#11-otp-types)
12. [Sistema de Status](#sistema-de-status)
13. [Patrón custom_data](#patrón-custom_data)

---

## 1. LeadApi

Representa un prospecto/lead en el pipeline de ventas.

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace al que pertenece |
| `first_name` | `string` | required | — | Primer nombre. Auto-normalizado a proper case (ej: `"juan"` -> `"Juan"`) |
| `last_name` | `string` | required | — | Apellido. Auto-normalizado a proper case |
| `email` | `string` | optional | — | Correo electronico. Auto-convertido a minusculas y trimmed |
| `phone_code` | `string` | optional | `'+57'` | Codigo de pais del telefono |
| `phone` | `string` | optional | — | Numero de telefono |
| `lead_status_id` | `string \| null` (UUID) | optional | `null` | FK a `lead_statuses`. Define el estado del lead en el pipeline |
| `sales_rep_id` | `string \| null` (UUID) | optional | `null` | FK a `sales_reps`. Vendedor asignado |
| `service_plan_id` | `string \| null` (UUID) | optional | `null` | FK a `isp_plans`. Plan de servicio de interes |
| `sale_product_id` | `string \| null` (UUID) | optional | `null` | FK a `products`. Producto de interes |
| `status` | `string` | auto | `'A'` | Status del sistema: `'A'`=activo, `'I'`=inactivo, `'T'`=eliminado |
| `custom_data` | `object \| null` | optional | `null` | JSONB para campos no esenciales (ver [patron custom_data](#patrón-custom_data)) |
| `created_at` | `string` | auto | now | Fecha de creacion (ISO datetime) |
| `updated_at` | `string` | auto | now | Fecha de ultima actualizacion (ISO datetime) |
| `deleted_at` | `string \| null` | auto | `null` | Fecha de soft delete (ISO datetime). Se setea al marcar `status = 'T'` |

**Ejemplo de creacion:**

```json
{
  "workspace_id": "bd7387f4-96e1-4676-ae50-bf9fdfc1da38",
  "first_name": "juan",
  "last_name": "perez",
  "email": "Juan.Perez@Gmail.COM",
  "phone_code": "+57",
  "phone": "3001234567",
  "lead_status_id": "a1b2c3d4-...",
  "sales_rep_id": "e5f6g7h8-..."
}
```

> **Nota:** No enviar `status`, `id`, `created_at`, `updated_at` ni `deleted_at` en creacion. El backend los genera automaticamente.

---

## 2. ClientApi

Representa un cliente registrado. Puede ser persona natural o juridica.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `lead_id` | `string \| null` (UUID) | optional | `null` | FK a `leads`. Lead del cual se convirtio |
| `client_code` | `string` | auto | auto-generated | Codigo secuencial (ej: `'CLI-0001'`) |
| `client_type` | `string` | optional | `'persona_natural'` | Tipo de cliente |
| `first_name` | `string \| null` | conditional | `null` | Nombre (para `persona_natural`) |
| `last_name` | `string \| null` | conditional | `null` | Apellido (para `persona_natural`) |
| `business_name` | `string \| null` | conditional | `null` | Razon social (para `persona_juridica`) |
| `document_type` | `string \| null` | optional | `null` | Tipo de documento de identidad |
| `document_number` | `string \| null` | optional | `null` | Numero de documento |
| `email` | `string` | required | — | Correo electronico. NOT NULL. Auto-convertido a minusculas |
| `phone` | `string` | required | — | Telefono. NOT NULL |
| `phone_code` | `string` | optional | `'+57'` | Codigo de pais |
| `client_status` | `string` | optional | `'activo'` | Status de dominio (negocio) |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `custom_data` | `object \| null` | optional | `null` | JSONB para campos custom |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |
| `deleted_at` | `string \| null` | auto | `null` | Fecha de soft delete |

**Valores de `client_type`:**

| Valor | Descripcion |
|-------|-------------|
| `'persona_natural'` | Persona fisica/natural (default) |
| `'persona_juridica'` | Empresa / persona juridica |

**Valores de `document_type`:**

| Valor | Descripcion |
|-------|-------------|
| `'CC'` | Cedula de Ciudadania |
| `'NIT'` | Numero de Identificacion Tributaria |
| `'CE'` | Cedula de Extranjeria |
| `'TI'` | Tarjeta de Identidad |
| `'PP'` | Pasaporte |
| `'PEP'` | Permiso Especial de Permanencia |

**Valores de `client_status` (status de dominio):**

| Valor | Descripcion |
|-------|-------------|
| `'activo'` | Cliente activo (default) |
| `'inactivo'` | Cliente inactivo |
| `'suspendido'` | Cliente suspendido |
| `'cancelado'` | Cliente cancelado |

---

## 3. ContractApi

Representa un contrato de servicio vinculado a un cliente.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `client_id` | `string` (UUID) | required | — | FK a `clients`. Cliente titular |
| `service_plan_id` | `string \| null` (UUID) | optional | `null` | FK a `isp_plans`. Plan contratado |
| `quotation_id` | `string \| null` (UUID) | optional | `null` | FK a cotizacion origen |
| `sales_rep_id` | `string \| null` (UUID) | optional | `null` | FK a `sales_reps`. Vendedor responsable |
| `sale_product_id` | `string \| null` (UUID) | optional | `null` | FK a `products`. Producto asociado |
| `branch_id` | `string \| null` (UUID) | optional | `null` | FK a `branches`. Sucursal |
| `code` | `string` | auto | auto-generated | Codigo corto (ej: `'CT-a1b2'`) |
| `contract_number` | `string` | auto | auto-generated | Numero secuencial (ej: `'CTR-0001'`) |
| `contract_date` | `string` | optional | hoy | Fecha del contrato (`YYYY-MM-DD`) |
| `start_date` | `string` | optional | hoy | Fecha de inicio (`YYYY-MM-DD`) |
| `end_date` | `string \| null` | optional | `null` | Fecha de fin (`YYYY-MM-DD`) |
| `contract_status` | `string` | optional | `'activo'` | Status de dominio |
| `plan` | `string \| null` | optional | `null` | Nombre del plan (texto) |
| `monthly_amount` | `number` | optional | `0` | Monto mensual |
| `total_amount` | `number` | optional | `0` | Monto total |
| `notes` | `string \| null` | optional | `null` | Notas adicionales |
| `installation_address` | `string \| null` | optional | `null` | Direccion de instalacion |
| `latitude` | `number \| null` | optional | `null` | Latitud GPS |
| `longitude` | `number \| null` | optional | `null` | Longitud GPS |
| `has_coverage` | `number` | optional | `0` | Tiene cobertura: `0`=no, `1`=si |
| `custom_data` | `object \| null` | optional | `null` | JSONB para campos custom |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |
| `deleted_at` | `string \| null` | auto | `null` | Fecha de soft delete |

**Campos JOINed (solo en respuestas GET, no enviar en creacion/update):**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `client_name` | `string \| null` | Nombre completo del cliente |
| `client_number` | `string \| null` | Codigo del cliente (ej: `'CLI-0001'`) |
| `sales_rep_name` | `string \| null` | Nombre del vendedor |
| `sale_product_name` | `string \| null` | Nombre del producto |

**Valores de `contract_status` (status de dominio):**

| Valor | Descripcion |
|-------|-------------|
| `'activo'` | Contrato vigente (default) |
| `'vencido'` | Contrato vencido |
| `'cancelado'` | Contrato cancelado |
| `'pendiente'` | Contrato pendiente de activacion |

---

## 4. SaleApi

Representa una venta registrada en el sistema.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `client_id` | `string \| null` (UUID) | optional | `null` | FK a `clients` |
| `lead_id` | `string \| null` (UUID) | optional | `null` | FK a `leads` |
| `sales_rep_id` | `string \| null` (UUID) | optional | `null` | FK a `sales_reps`. Vendedor |
| `seller_id` | `string \| null` (UUID) | auto | `null` | FK a `users`. Auto-resuelto desde `sales_rep_id` |
| `code` | `string` | auto | auto-generated | Codigo corto (ej: `'VTA-c3d4'`) |
| `sale_number` | `string` | auto | auto-generated | Numero secuencial (ej: `'VTA-0001'`) |
| `sale_date` | `string` | optional | hoy | Fecha de la venta (`YYYY-MM-DD`) |
| `document_type` | `string` | optional | `'nota_venta'` | Tipo de documento |
| `sale_status` | `string` | optional | `'pendiente'` | Status de dominio |
| `subtotal` | `number` | optional | auto-calculado | Subtotal. Si no se envia, se calcula desde los items |
| `tax_amount` | `number` | optional | `0` | Monto total de impuestos |
| `total_amount` | `number` | required | — | Monto total de la venta |
| `total` | `number` | — | — | Alias de `total_amount` (mismo valor) |
| `commission` | `number` | optional | auto-calculado | Comision. Si no se envia, se calcula desde los productos |
| `notes` | `string \| null` | optional | `null` | Notas adicionales |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |
| `deleted_at` | `string \| null` | auto | `null` | Fecha de soft delete |

**Campos JOINed (solo en respuestas GET):**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `client_name` | `string \| null` | Nombre completo del cliente |
| `client_email` | `string \| null` | Email del cliente |
| `client_phone` | `string \| null` | Telefono del cliente |
| `client_address` | `string \| null` | Direccion del cliente |
| `sales_rep_name` | `string \| null` | Nombre del vendedor |
| `items` | `SaleItemApi[]` | Array de items de la venta (JSON anidado en listado, objetos completos en get-by-id) |

**Valores de `sale_status` (status de dominio):**

| Valor (ES) | Valor (EN) aceptado en input | Descripcion |
|------------|------------------------------|-------------|
| `'pendiente'` | `'pending'` | Venta pendiente (default) |
| `'completada'` | `'completed'` | Venta completada |
| `'cancelada'` | `'cancelled'` | Venta cancelada |
| `'reembolsada'` | `'refunded'` | Venta reembolsada |

> **Nota sobre sale_status:** El backend acepta valores en ingles en el input y los convierte automaticamente a espanol. Las respuestas siempre devuelven los valores en espanol.

---

## 5. SaleItemApi

Representa un item/linea dentro de una venta. Se envia como array en el campo `items` de `SaleApi`.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `sale_id` | `string` (UUID) | auto | — | FK a `sales`. Se asigna automaticamente |
| `item_type` | `string` | optional | `'product'` | Tipo de item |
| `item_id` | `string` (UUID) | required | — | FK a `products`. Producto o servicio |
| `name` | `string` | required | — | Nombre del item |
| `description` | `string \| null` | optional | `null` | Descripcion del item |
| `unit_price` | `number` | required | — | Precio unitario |
| `quantity` | `number` | optional | `1` | Cantidad |
| `tax_type` | `string` | optional | `'iva'` | Tipo de impuesto |
| `tax_rate` | `number` | optional | `0` | Tasa de impuesto (ej: `0.19` para 19%) |
| `tax_amount` | `number` | auto | auto-calculado | Monto del impuesto: `unit_price * quantity * tax_rate` |
| `discount_amount` | `number` | optional | `0` | Monto de descuento |
| `subtotal` | `number` | auto | auto-calculado | Subtotal: `unit_price * quantity` |
| `seller_commission` | `number` | optional | `0` | Comision del vendedor |
| `technician_commission` | `number` | optional | `0` | Comision del tecnico |
| `created_at` | `string` | auto | now | Fecha de creacion |

**Valores de `item_type`:**

| Valor | Descripcion |
|-------|-------------|
| `'product'` | Producto fisico (default) |
| `'service'` | Servicio |

**Formulas de calculo automatico:**

```
subtotal     = unit_price * quantity
tax_amount   = unit_price * quantity * tax_rate
total_linea  = subtotal + tax_amount - discount_amount
```

---

## 6. IspPlanApi

Representa un plan de servicio ISP (internet, TV, etc.).

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `code` | `string` | required | — | Codigo del plan |
| `name` | `string` | required | — | Nombre del plan |
| `description` | `string \| null` | optional | `null` | Descripcion del plan |
| `type` | `string` | required | — | Tipo de servicio |
| `speed_down` | `number \| null` | optional | `null` | Velocidad de descarga en Mbps |
| `speed_up` | `number \| null` | optional | `null` | Velocidad de subida en Mbps |
| `price` | `number` | required | — | Precio mensual |
| `installation_price` | `number` | required | — | Precio de instalacion |
| `tax_id` | `string \| null` (UUID) | optional | `null` | FK a tabla de impuestos |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |

**Valores de `type`:**

| Valor | Descripcion |
|-------|-------------|
| `'internet'` | Servicio de internet |
| `'tv'` | Servicio de television |
| `'telefonia'` | Servicio de telefonia |
| `'combo'` | Paquete combinado |
| `'otro'` | Otro tipo de servicio |

---

## 7. ProductApi

Representa un producto o servicio disponible para venta.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `code` | `string` | required | — | Codigo del producto |
| `name` | `string` | required | — | Nombre del producto |
| `description` | `string \| null` | optional | `null` | Descripcion |
| `category` | `string \| null` | optional | `null` | Nombre de la categoria (texto) |
| `category_id` | `string \| null` (UUID) | optional | `null` | FK a tabla de categorias |
| `brand` | `string \| null` | optional | `null` | Marca |
| `model` | `string \| null` | optional | `null` | Modelo |
| `unit` | `string \| null` | optional | `null` | Unidad de medida |
| `cost` | `number \| null` | optional | `null` | Costo del producto |
| `price` | `number \| null` | optional | `null` | Precio de venta |
| `min_stock` | `number \| null` | optional | `null` | Stock minimo |
| `max_stock` | `number \| null` | optional | `null` | Stock maximo |
| `barcode` | `string \| null` | optional | `null` | Codigo de barras |
| `sku` | `string \| null` | optional | `null` | SKU (Stock Keeping Unit) |
| `product_status` | `string \| null` | optional | `null` | Status de dominio del producto |
| `sales_commission` | `number \| null` | optional | `null` | Comision de venta. Usado para auto-calculo en ventas |
| `installation_commission` | `number \| null` | optional | `null` | Comision de instalacion. Usado para auto-calculo en ventas |
| `requires_serial` | `number` | optional | `0` | Requiere numero de serie: `0`=no, `1`=si |
| `requires_mac` | `number` | optional | `0` | Requiere direccion MAC: `0`=no, `1`=si |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |

---

## 8. LeadStatusApi

Representa un estado configurable del pipeline de leads. Cada workspace define sus propios estados.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `name` | `string` | required | — | Nombre del estado (ej: `"Nuevo"`, `"Contactado"`, `"Interesado"`, `"Cerrado"`) |
| `color` | `string` | required | — | Color hex para UI (ej: `"#3b82f6"`) |
| `order_index` | `number` | required | — | Orden en el pipeline (ascendente, 0 = primero) |
| `is_default` | `number` | optional | `0` | Es el estado por defecto para leads nuevos: `0`=no, `1`=si |
| `is_completion` | `number` | optional | `0` | Marca el lead como ganado/completado: `0`=no, `1`=si |
| `is_cancellation` | `number` | optional | `0` | Marca el lead como perdido/cancelado: `0`=no, `1`=si |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |

**Ejemplo tipico de pipeline:**

```
order_index: 0 → "Nuevo"          (is_default: 1)
order_index: 1 → "Contactado"
order_index: 2 → "Interesado"
order_index: 3 → "En negociacion"
order_index: 4 → "Cerrado-Ganado" (is_completion: 1)
order_index: 5 → "Cerrado-Perdido"(is_cancellation: 1)
```

---

## 9. SalesRepApi

Representa un vendedor/representante de ventas. Vinculado a un usuario del sistema.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `user_id` | `string` (UUID) | required | — | FK a `users`. Usuario vinculado |
| `commission_rate` | `number` | required | — | Tasa de comision |
| `target_leads` | `number` | optional | `0` | Meta de leads |
| `target_sales` | `number` | optional | `0` | Meta de ventas |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `created_at` | `string` | auto | now | Fecha de creacion |
| `updated_at` | `string` | auto | now | Fecha de actualizacion |

**Campos JOINed desde `users` (disponibles cuando `with_user_info=true` en query params):**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `email` | `string` | Email del usuario |
| `first_names` | `string` | Nombres del usuario |
| `last_names` | `string` | Apellidos del usuario |
| `avatar` | `string \| null` | URL del avatar |

---

## 10. WizardConfig

Configuracion de formularios wizard dinamicos. Permite definir formularios multi-paso para la creacion de leads, clientes y contratos.

### WizardConfig (raiz)

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `workspace_id` | `string` (UUID) | required | — | Tenant/workspace |
| `entity_type` | `string` | required | — | Tipo de entidad del wizard |
| `name` | `string` | required | — | Nombre del wizard |
| `description` | `string \| null` | optional | `null` | Descripcion |
| `is_default` | `boolean` | optional | `false` | Es el wizard por defecto para esta entidad |
| `status` | `string` | auto | `'A'` | Status del sistema |
| `metadata` | `object \| null` | optional | `null` | Metadata adicional |
| `steps` | `WizardStep[]` | — | `[]` | Array de pasos del wizard (incluido en respuestas GET) |

**Valores de `entity_type`:**

| Valor | Descripcion |
|-------|-------------|
| `'lead'` | Wizard para crear/editar leads |
| `'client'` | Wizard para crear/editar clientes |
| `'contract'` | Wizard para crear/editar contratos |

### WizardStep

Cada paso del wizard contiene un grupo logico de campos.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `wizard_config_id` | `string` (UUID) | auto | — | FK al wizard padre |
| `name` | `string` | required | — | Titulo del paso (ej: `"Informacion Personal"`) |
| `description` | `string \| null` | optional | `null` | Descripcion del paso |
| `icon` | `string \| null` | optional | `null` | Clase FontAwesome (ej: `'fa-user'`) |
| `order` | `number` | required | — | Secuencia del paso (ascendente) |
| `fields` | `WizardField[]` | — | `[]` | Array de campos del paso (incluido en respuestas GET) |

### WizardField

Definicion de un campo individual dentro de un paso del wizard.

| Campo | Tipo | Requerido | Default | Descripcion |
|-------|------|-----------|---------|-------------|
| `id` | `string` (UUID) | auto | auto-generated | Identificador unico |
| `step_id` | `string` (UUID) | auto | — | FK al paso padre |
| `name` | `string` | required | — | Key del campo (ej: `'first_name'`, `'referido_por'`) |
| `label` | `string` | required | — | Label para mostrar en UI (ej: `'Primer Nombre'`) |
| `field_type` | `string` | required | — | Tipo de campo para renderizar |
| `is_required` | `boolean` | required | — | Campo obligatorio |
| `is_system_field` | `boolean` | required | — | `true` = se mapea a columna DB, `false` = va a `custom_data` |
| `system_field_mapping` | `string \| null` | conditional | `null` | Nombre de la columna DB cuando `is_system_field=true` |
| `options` | `string[] \| object[] \| null` | optional | `null` | Opciones estaticas para `select`/`multiselect` (cuando no hay `data_source`) |
| `data_source` | `string \| null` | optional | `null` | Fuente de datos dinamica para `select`/`multiselect` |
| `data_source_filters` | `object \| null` | optional | `null` | Filtros para la fuente de datos (ej: `{ "branch_id": "{branch_id}" }`) |
| `placeholder` | `string \| null` | optional | `null` | Texto placeholder |
| `default_value` | `any \| null` | optional | `null` | Valor por defecto |
| `validations` | `object \| null` | optional | `null` | Reglas de validacion |
| `hidden_conditions` | `object \| null` | optional | `null` | Condiciones para ocultar el campo |
| `order` | `number` | required | — | Secuencia dentro del paso (ascendente) |
| `default_country_code` | `string \| null` | optional | `null` | Codigo de pais para campos tipo `phone` (ej: `'CO'`) |

**Valores de `field_type`:**

| Valor | Descripcion | Notas |
|-------|-------------|-------|
| `'text'` | Texto libre | Input de texto simple |
| `'number'` | Numerico | Input numerico |
| `'phone'` | Telefono | Input con selector de codigo de pais |
| `'email'` | Email | Input con validacion de email |
| `'select'` | Selector simple | Dropdown de seleccion unica |
| `'multiselect'` | Selector multiple | Dropdown de seleccion multiple |
| `'date'` | Fecha | Date picker |
| `'photo'` | Foto/Imagen | Captura o seleccion de imagen |
| `'location'` | Ubicacion GPS | Selector de ubicacion con mapa |
| `'textarea'` | Texto largo | Input de texto multilinea |

**Valores de `data_source`:**

| Valor | Descripcion | Endpoint implicito |
|-------|-------------|-------------------|
| `'isp_plans'` | Planes de servicio ISP | `GET /api/isp-plans` |
| `'products'` | Productos | `GET /api/products` |
| `'sales_reps'` | Vendedores | `GET /api/sales-reps` |
| `'lead_statuses'` | Estados del pipeline | `GET /api/lead-statuses` |
| `'branches'` | Sucursales | `GET /api/branches` |
| `'zones'` | Zonas | `GET /api/zones` |
| `'clients'` | Clientes | `GET /api/clients` |

**Ejemplo de `validations`:**

```json
{
  "min": 0,
  "max": 100,
  "pattern": "^[0-9]+$"
}
```

**Ejemplo de `data_source_filters` (campos dependientes):**

```json
{
  "branch_id": "{branch_id}"
}
```

> El valor `"{branch_id}"` indica que se debe reemplazar dinamicamente con el valor actual del campo `branch_id` en el formulario. Esto permite que al seleccionar una sucursal, las zonas se filtren automaticamente.

---

## 11. OTP Types

Tipos para el sistema de One-Time Password (OTP), usado para firma de contratos y verificaciones.

### OtpPurpose (enum)

| Valor | Descripcion |
|-------|-------------|
| `'contract_sign'` | Firma de contrato |
| `'installation_verify'` | Verificacion de instalacion |
| `'general'` | Proposito general |

### GenerateOtpRequest

Payload para solicitar un OTP.

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `email` | `string` | required | Email donde enviar el OTP |
| `purpose` | `OtpPurpose` | required | Proposito del OTP |
| `user_name` | `string` | optional | Nombre del usuario (para personalizar el email) |
| `workspace_id` | `string` | optional | Workspace asociado |
| `reference_id` | `string` | optional | ID de referencia (ej: contract_id) |
| `reference_type` | `string` | optional | Tipo de referencia (ej: `'contract'`) |

### GenerateOtpResponse

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `expires_at` | `string` | Fecha de expiracion del OTP (ISO datetime) |

### VerifyOtpRequest

Payload para verificar un OTP ingresado por el usuario.

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| `email` | `string` | required | Email al que se envio el OTP |
| `otp` | `string` | required | Codigo OTP ingresado |
| `purpose` | `OtpPurpose` | required | Proposito original del OTP |
| `reference_id` | `string` | optional | ID de referencia para validacion |
| `mark_used` | `boolean` | optional | Marcar el OTP como usado despues de verificar |

### VerifyOtpResponse

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `verified` | `boolean` | `true` si el OTP es valido |
| `token_id` | `string` | ID del token verificado (solo si `verified=true`) |

**Ejemplo de flujo OTP para firma de contrato:**

```
1. POST /api/otp/generate
   { "email": "cliente@email.com", "purpose": "contract_sign", "reference_id": "contract-uuid" }
   → { "expires_at": "2026-03-04T16:00:00.000Z" }

2. El cliente recibe el OTP por email

3. POST /api/otp/verify
   { "email": "cliente@email.com", "otp": "123456", "purpose": "contract_sign", "mark_used": true }
   → { "verified": true, "token_id": "token-uuid" }
```

---

## Sistema de Status

El sistema maneja **dos niveles de status** para cada entidad. Es fundamental entender la diferencia para construir correctamente la app mobile.

### Status Unificado (sistema)

Campo: `status CHAR(1)` — presente en **TODAS** las tablas.

| Valor | Nombre | Descripcion |
|-------|--------|-------------|
| `'A'` | Activo | Registro visible y funcional |
| `'I'` | Inactivo | Deshabilitado pero no eliminado |
| `'T'` | Trash | Soft-deleted, marcado con `deleted_at` |

**Reglas importantes:**

- Los endpoints de listado filtran `WHERE status = 'A'` por defecto. Solo se reciben registros activos.
- Una peticion `DELETE` **no borra fisicamente** el registro. Marca `status = 'T'` y setea `deleted_at = CURRENT_TIMESTAMP`.
- **NO enviar `status` en creacion.** El backend lo pone en `'A'` automaticamente.
- Para desactivar un registro sin eliminarlo, enviar `status: 'I'` en un `PUT`/`PATCH`.

### Status de Dominio (negocio)

Especifico por entidad. Refleja el estado de negocio del registro, independiente de si esta activo o eliminado en el sistema.

| Entidad | Campo | Valores posibles | Default |
|---------|-------|------------------|---------|
| **Lead** | `lead_status_id` | UUID (FK a tabla `lead_statuses`) | El status con `is_default: 1` |
| **Client** | `client_status` | `'activo'`, `'inactivo'`, `'suspendido'`, `'cancelado'` | `'activo'` |
| **Contract** | `contract_status` | `'activo'`, `'vencido'`, `'cancelado'`, `'pendiente'` | `'activo'` |
| **Sale** | `sale_status` | `'pendiente'`, `'completada'`, `'cancelada'`, `'reembolsada'` | `'pendiente'` |

> **Ejemplo:** Un contrato puede tener `contract_status = 'cancelado'` (el contrato fue cancelado como decision de negocio) pero `status = 'A'` (el registro sigue activo y visible en el sistema). Si luego se "elimina", pasaria a `status = 'T'` y se setea `deleted_at`.

---

## Patron custom_data

El campo `custom_data` (JSONB) permite almacenar campos adicionales definidos por cada workspace sin modificar el esquema de la base de datos.

### Como funciona

La configuracion del wizard (ver [WizardConfig](#10-wizardconfig)) define cada campo con una propiedad `is_system_field`:

| `is_system_field` | Donde se almacena | Ejemplo |
|-------------------|-------------------|---------|
| `true` | Columna dedicada en la tabla DB | `first_name`, `email`, `phone` |
| `false` | Dentro del objeto `custom_data` | `referido_por`, `notas_extra`, `preferencia_horario` |

### Como enviar datos al crear/actualizar

Se deben **separar los campos de sistema** (como propiedades top-level) de los **campos custom** (dentro del objeto `custom_data`).

**Ejemplo:** Si el wizard tiene los campos `first_name` (system), `email` (system) y `referido_por` (custom):

```json
{
  "first_name": "Juan",
  "email": "juan@email.com",
  "custom_data": {
    "referido_por": "Campana Facebook"
  }
}
```

**Ejemplo con multiples campos custom:**

```json
{
  "first_name": "Maria",
  "last_name": "Garcia",
  "email": "maria@email.com",
  "phone": "3009876543",
  "lead_status_id": "uuid-del-status",
  "sales_rep_id": "uuid-del-vendedor",
  "custom_data": {
    "referido_por": "Campana Instagram",
    "preferencia_horario": "manana",
    "direccion_provisional": "Calle 45 #12-30",
    "numero_de_personas": 4
  }
}
```

### Lectura de custom_data

En las respuestas GET, `custom_data` viene como un objeto JSON con todas las propiedades custom:

```json
{
  "id": "uuid-del-lead",
  "first_name": "Juan",
  "email": "juan@email.com",
  "custom_data": {
    "referido_por": "Campana Facebook",
    "preferencia_horario": "manana"
  }
}
```

### Tips para la app mobile

1. **Parsear el wizard config al inicio** para saber que campos son system y cuales custom.
2. **Al construir el payload**, iterar los campos del wizard y colocar cada valor en el nivel correcto.
3. **`custom_data` puede ser `null`** si no hay campos custom o no se llenaron.
4. **Los tipos de los valores custom** dependen del `field_type` del wizard field (text -> string, number -> number, date -> string ISO, etc.).
5. **No enviar `custom_data: {}`** vacio. Enviar `null` o no incluir el campo si no hay datos custom.

# NextCore Mobile - Documentacion API para App de Vendedores

Documentacion completa para el desarrollo de la app movil de vendedores NextCore.

## Quick Start

```
Base URL (dev):  http://localhost:3001/api
Base URL (prod): https://nextcorenow.com/api

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
```

### Setup en 3 pasos

1. **Login**: `POST /api/auth/login` con email y password -> obtener `token`, `workspace_id`, `user_id`
2. **Perfil vendedor**: `GET /api/sales-reps/me?workspace_id=X&user_id=Y` -> obtener `sales_rep_id`
3. **Cachear datos**: Cargar `lead_statuses`, `isp_plans`, `products`, `branches` y `wizard_configs` (lead, client, contract)

### Flujo principal

```
Login -> Dashboard -> Crear Lead -> Crear Cliente -> Crear Contrato -> Registrar Venta
```

---

## Documentos

| Documento | Descripcion |
|-----------|-------------|
| [API_GUIDE.md](./API_GUIDE.md) | Guia principal: auth, formato de respuesta, status, errores, formularios dinamicos |
| [SALES_FLOW.md](./SALES_FLOW.md) | Flujo paso a paso del proceso de venta completo |
| [ENDPOINTS.md](./ENDPOINTS.md) | Referencia de ~34 endpoints con request/response detallados |
| [DATA_MODELS.md](./DATA_MODELS.md) | Modelos de datos, interfaces, enums y validaciones |
| [POSTMAN_COLLECTION.json](./POSTMAN_COLLECTION.json) | Coleccion Postman lista para importar y probar |

---

## Conceptos Clave

- **workspace_id**: Requerido en TODAS las peticiones. Query param en GET, body en POST/PUT.
- **Formularios dinamicos**: Los formularios se generan desde `wizard_configs`. Cada workspace puede tener campos diferentes.
- **custom_data**: Campos no-esenciales van en un JSONB flexible. Campos de sistema van en columnas DB directas.
- **Soft delete**: `DELETE` marca `status='T'` + `deleted_at`. Nunca elimina fisicamente.
- **Status dual**: `status` (A/I/T) es del sistema. `lead_status_id`, `client_status`, etc. son de negocio.

---

*Ultima actualizacion: Marzo 2026*

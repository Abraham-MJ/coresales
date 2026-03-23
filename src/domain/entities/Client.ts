export interface Client {
  id: string;
  workspace_id: string;
  lead_id: string | null;
  client_code: string;
  client_type: 'persona_natural' | 'persona_juridica';
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  document_type: 'CC' | 'NIT' | 'CE' | 'TI' | 'PP' | 'PEP' | null;
  document_number: string | null;
  email: string;
  phone: string;
  phone_code: string;
  client_status: 'activo' | 'inactivo' | 'suspendido' | 'cancelado';
  custom_data: Record<string, any> | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateClientDto {
  workspace_id: string;
  lead_id?: string;
  client_type?: 'persona_natural' | 'persona_juridica';
  first_name?: string;
  last_name?: string;
  business_name?: string;
  document_type?: 'CC' | 'NIT' | 'CE' | 'TI' | 'PP' | 'PEP';
  document_number?: string;
  email: string;
  phone: string;
  phone_code?: string;
  client_status?: 'activo' | 'inactivo' | 'suspendido' | 'cancelado';
  custom_data?: Record<string, any>;
}

export interface FieldMapping {
  source_field: string;
  target_field: string;
}

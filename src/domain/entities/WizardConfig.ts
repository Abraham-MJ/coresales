export interface WizardConfig {
  id: string;
  workspace_id: string;
  entity_type: 'lead' | 'client' | 'contract';
  name: string;
  description?: string;
  is_default: boolean;
  steps: WizardStep[];
}

export interface WizardStep {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  fields: WizardField[];
}

export interface WizardField {
  id: string;
  name: string;
  label: string;
  field_type: 'text' | 'number' | 'phone' | 'email' | 'select' | 'multiselect' | 'date' | 'photo' | 'location' | 'textarea';
  is_required: boolean;
  is_system_field: boolean;
  system_field_mapping?: string | null;
  options?: string[] | object[] | null;
  data_source?: string | null;
  data_source_filters?: Record<string, any> | null;
  placeholder?: string | null;
  default_value?: any;
  validations?: Record<string, any> | null;
  hidden_conditions?: Record<string, any> | null;
  order: number;
  default_country_code?: string | null;
}

export interface Lead {
  id: string;
  workspace_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_code?: string;
  phone?: string;
  lead_status_id?: string;
  sales_rep_id?: string;
  service_plan_id?: string;
  sale_product_id?: string;
  custom_data?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateLeadDto {
  workspace_id: string;
  sales_rep_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_code?: string;
  phone?: string;
  lead_status_id?: string;
  service_plan_id?: string;
  sale_product_id?: string;
  custom_data?: Record<string, any>;
}

export interface LeadListResponse {
  items: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

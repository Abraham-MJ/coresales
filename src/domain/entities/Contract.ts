export interface Contract {
  id: string;
  workspace_id: string;
  client_id: string;
  service_plan_id: string | null;
  sales_rep_id: string | null;
  branch_id: string | null;
  code: string;
  contract_number: string;
  contract_date: string;
  start_date: string;
  end_date: string | null;
  contract_status: 'activo' | 'vencido' | 'cancelado' | 'pendiente';
  plan: string | null;
  monthly_amount: number;
  total_amount: number;
  installation_address: string | null;
  latitude: number | null;
  longitude: number | null;
  has_coverage: number;
  custom_data: Record<string, any> | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContractDto {
  workspace_id: string;
  client_id: string;
  service_plan_id?: string;
  sales_rep_id?: string;
  branch_id?: string;
  contract_date?: string;
  start_date?: string;
  end_date?: string;
  contract_status?: 'activo' | 'vencido' | 'cancelado' | 'pendiente';
  plan?: string;
  monthly_amount?: number;
  total_amount?: number;
  installation_address?: string;
  latitude?: number;
  longitude?: number;
  has_coverage?: number;
  custom_data?: Record<string, any>;
}

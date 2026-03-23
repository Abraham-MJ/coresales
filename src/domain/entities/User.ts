export interface User {
  id: string;
  workspace_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  user_type: string;
  avatar?: string;
  token: string;
}

export interface SalesRep {
  id: string;
  user_id: string;
  workspace_id: string;
  commission_rate: number;
  target_leads: number;
  target_sales: number;
  status: string;
  email: string;
  first_names: string;
  last_names: string;
  avatar?: string;
  phone?: string;
  document_number?: string;
}

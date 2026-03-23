export interface Sale {
  id: string;
  workspace_id: string;
  client_id: string | null;
  lead_id: string | null;
  sales_rep_id: string | null;
  code: string;
  sale_number: string;
  sale_date: string;
  sale_status: 'pendiente' | 'completada' | 'cancelada' | 'reembolsada';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  commission: number;
  items: SaleItem[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id?: string;
  product_id: string;
  name: string;
  type: 'product' | 'service';
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_type?: string;
  discount_amount?: number;
  description?: string;
}

export interface CreateSaleDto {
  workspace_id: string;
  client_id?: string;
  lead_id?: string | null;
  sales_rep_id?: string;
  sale_date?: string;
  sale_status?: 'pending' | 'completed' | 'cancelled' | 'refunded' | 'pendiente' | 'completada' | 'cancelada' | 'reembolsada';
  total_amount: number;
  subtotal?: number;
  tax_amount?: number;
  items: SaleItem[];
}

export interface Branch {
  id: string;
  workspace_id: string;
  name: string;
  address: string;
  status: string;
}

export interface Zone {
  id: string;
  workspace_id: string;
  branch_id: string;
  name: string;
  status: string;
}

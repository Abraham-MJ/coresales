export interface DashboardStats {
  total_receivable: number;
  leads_available: number;
  leads_pending: number;
  sales_completed: number;
  sales_target_percentage: number;
  total_sales_amount: number;
}

export interface DashboardData {
  sales_rep: {
    id: string;
    first_names: string;
    last_names: string;
    avatar: string | null;
    email: string;
    commission_rate: number;
    target_leads: number;
    target_sales: number;
  };
  stats: DashboardStats;
  today_tasks_count: number;
}

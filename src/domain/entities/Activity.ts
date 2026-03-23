export interface Task {
  id: string;
  workspace_id?: string;
  title: string;
  description?: string;
  type?: 'general' | 'call' | 'meeting' | 'follow_up';
  priority?: 'low' | 'medium' | 'high';
  task_status: 'pending' | 'completed' | 'cancelled';
  assigned_to: string;
  due_date?: string;
  client_id?: string | null;
  client_name?: string | null;
  location?: string | null;
  notes?: string | null;
  status?: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface ActivityFeedItem {
  id: string;
  type: 'lead_created' | 'sale_registered' | 'client_created' | 'contract_signed';
  title: string;
  description: string;
  status: string;
  status_color?: string;
  created_at: string;
  time_ago: string;
}

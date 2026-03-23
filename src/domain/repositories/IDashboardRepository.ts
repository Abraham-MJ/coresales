import { DashboardData } from '../entities/Dashboard';
import { Workspace } from '../entities/Workspace';
import { Task, ActivityFeedItem } from '../entities/Activity';

export interface IDashboardRepository {
  getDashboard(workspace_id: string, user_id: string): Promise<DashboardData>;
  getWorkspace(workspace_id: string): Promise<Workspace>;
  getTasks(workspace_id: string, sales_rep_id: string, limit?: number): Promise<Task[]>;
  getActivityFeed(workspace_id: string, sales_rep_id: string, limit?: number): Promise<ActivityFeedItem[]>;
}

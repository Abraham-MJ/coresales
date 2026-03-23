import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
import { DashboardData } from '@domain/entities/Dashboard';
import { Workspace } from '@domain/entities/Workspace';
import { Task, ActivityFeedItem } from '@domain/entities/Activity';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { ENDPOINTS } from '@shared/constants/api.constants';
import { ApiResponse } from '@shared/types/api.types';

export class ApiDashboardRepository implements IDashboardRepository {
  async getDashboard(workspace_id: string, user_id: string): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      ENDPOINTS.SALES_REPS.DASHBOARD,
      {
        params: { workspace_id, user_id },
      }
    );

    return response.data.data;
  }

  async getWorkspace(workspace_id: string): Promise<Workspace> {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      `/workspaces/${workspace_id}`
    );

    return response.data.data;
  }

  async getTasks(workspace_id: string, sales_rep_id: string, limit: number = 5): Promise<Task[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ items: Task[] }>>(
        '/tasks',
        {
          params: {
            workspace_id,
            assigned_to: sales_rep_id,
            task_status: 'pending',
            limit,
          },
        }
      );

      return response.data.data.items || [];
    } catch (error: any) {
      return [];
    }
  }

  async getActivityFeed(workspace_id: string, sales_rep_id: string, limit: number = 10): Promise<ActivityFeedItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ items: ActivityFeedItem[] }>>(
        '/activity-feed',
        {
          params: {
            workspace_id,
            sales_rep_id,
            limit,
          },
        }
      );

      return response.data.data.items || [];
    } catch (error: any) {
      return [];
    }
  }
}

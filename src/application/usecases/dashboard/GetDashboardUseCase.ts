import { IDashboardRepository } from '@domain/repositories/IDashboardRepository';
import { DashboardData } from '@domain/entities/Dashboard';
import { Workspace } from '@domain/entities/Workspace';
import { Task, ActivityFeedItem } from '@domain/entities/Activity';

export interface DashboardWithWorkspace {
  dashboard: DashboardData;
  workspace: Workspace;
  tasks: Task[];
  activityFeed: ActivityFeedItem[];
}

export class GetDashboardUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(workspace_id: string, user_id: string, sales_rep_id: string): Promise<DashboardWithWorkspace> {
    // Obtener todos los datos en paralelo
    const [dashboard, workspace, tasks, activityFeed] = await Promise.all([
      this.dashboardRepository.getDashboard(workspace_id, user_id),
      this.dashboardRepository.getWorkspace(workspace_id),
      this.dashboardRepository.getTasks(workspace_id, sales_rep_id, 5),
      this.dashboardRepository.getActivityFeed(workspace_id, sales_rep_id, 10),
    ]);

    return { dashboard, workspace, tasks, activityFeed };
  }
}

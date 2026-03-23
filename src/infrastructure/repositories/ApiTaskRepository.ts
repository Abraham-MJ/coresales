import { Task } from '@domain/entities/Activity';
import { CreateTaskDto, ITaskRepository, UpdateTaskDto } from '@domain/repositories/ITaskRepository';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { ApiResponse } from '@shared/types/api.types';

export class ApiTaskRepository implements ITaskRepository {
  async getTasks(workspace_id: string, assigned_to: string, status?: string): Promise<Task[]> {
    const params: any = {
      workspace_id,
      assigned_to,
      limit: 100,
    };

    if (status) {
      params.task_status = status;
    }

    const response = await apiClient.get<ApiResponse<{ items: Task[] }>>('/tasks', { params });
    return response.data.data.items || [];
  }

  async getTaskById(id: string, workspace_id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`, {
      params: { workspace_id },
    });
    return response.data.data;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  }
}

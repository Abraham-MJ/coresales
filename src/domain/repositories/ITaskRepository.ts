import { Task } from '@domain/entities/Activity';

export interface CreateTaskDto {
  workspace_id: string;
  assigned_to: string;
  title: string;
  description?: string;
  type?: 'call' | 'meeting' | 'follow_up';
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
}

export interface UpdateTaskDto {
  task_status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  title?: string;
  description?: string;
  due_date?: string;
}

export interface ITaskRepository {
  getTasks(workspace_id: string, assigned_to: string, status?: string): Promise<Task[]>;
  getTaskById(id: string, workspace_id: string): Promise<Task>;
  createTask(data: CreateTaskDto): Promise<Task>;
  updateTask(id: string, data: UpdateTaskDto): Promise<Task>;
}

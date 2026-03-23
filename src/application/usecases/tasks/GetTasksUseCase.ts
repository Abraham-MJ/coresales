import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Activity';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(workspace_id: string, assigned_to: string, status?: string): Promise<Task[]> {
    return await this.taskRepository.getTasks(workspace_id, assigned_to, status);
  }
}

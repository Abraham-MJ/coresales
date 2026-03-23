import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Activity';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, workspace_id: string): Promise<Task> {
    return await this.taskRepository.getTaskById(id, workspace_id);
  }
}

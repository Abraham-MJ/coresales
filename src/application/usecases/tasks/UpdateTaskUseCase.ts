import { ITaskRepository, UpdateTaskDto } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Activity';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, data: UpdateTaskDto): Promise<Task> {
    return await this.taskRepository.updateTask(id, data);
  }
}

import { ITaskRepository, CreateTaskDto } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Activity';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(data);
  }
}

import { useState, useEffect } from 'react';
import { ApiTaskRepository } from '@infrastructure/repositories/ApiTaskRepository';
import { GetTaskByIdUseCase } from '@application/usecases/tasks/GetTaskByIdUseCase';
import { UpdateTaskUseCase } from '@application/usecases/tasks/UpdateTaskUseCase';
import { UpdateTaskDto } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Activity';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';

export const useTaskDetail = (taskId: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      if (!workspace_id) throw new Error('No se encontró workspace_id');

      const repository = new ApiTaskRepository();
      const useCase = new GetTaskByIdUseCase(repository);
      const result = await useCase.execute(taskId, workspace_id);
      setTask(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tarea');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (data: UpdateTaskDto): Promise<Task | null> => {
    try {
      const repository = new ApiTaskRepository();
      const useCase = new UpdateTaskUseCase(repository);
      const updated = await useCase.execute(taskId, data);
      setTask(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar tarea');
      return null;
    }
  };

  useEffect(() => {
    if (taskId) loadTask();
  }, [taskId]);

  return {
    task,
    loading,
    error,
    refresh: loadTask,
    updateTask,
  };
};

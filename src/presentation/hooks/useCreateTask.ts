import { CreateTaskUseCase } from '@application/usecases/tasks/CreateTaskUseCase';
import { Task } from '@domain/entities/Activity';
import { CreateTaskDto } from '@domain/repositories/ITaskRepository';
import { ApiTaskRepository } from '@infrastructure/repositories/ApiTaskRepository';
import { useState } from 'react';

export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (data: CreateTaskDto): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const repository = new ApiTaskRepository();
      const useCase = new CreateTaskUseCase(repository);
      const task = await useCase.execute(data);
      return task;
    } catch (err: any) {
      console.error('❌ [useCreateTask] Error al crear tarea:', err);
      console.error('❌ [useCreateTask] Response data:', err.response?.data);
      console.error('❌ [useCreateTask] Status:', err.response?.status);
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear tarea';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTask,
  };
};

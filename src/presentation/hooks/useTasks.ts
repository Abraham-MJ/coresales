import { useState, useEffect } from 'react';
import { ApiTaskRepository } from '@infrastructure/repositories/ApiTaskRepository';
import { GetTasksUseCase } from '@application/usecases/tasks/GetTasksUseCase';
import { Task } from '@domain/entities/Activity';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';

export const useTasks = (status?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      const sales_rep_id = await SecureStorage.getSalesRepId();

      if (!workspace_id || !sales_rep_id) {
        throw new Error('No se encontraron credenciales');
      }

      const repository = new ApiTaskRepository();
      const useCase = new GetTasksUseCase(repository);
      // Filtrar solo tareas pendientes desde el servidor
      const result = await useCase.execute(workspace_id, sales_rep_id, 'pending');
      setTasks(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refresh: loadTasks,
  };
};

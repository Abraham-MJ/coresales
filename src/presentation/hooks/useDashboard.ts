import { useState, useEffect } from 'react';
import { GetDashboardUseCase, DashboardWithWorkspace } from '@application/usecases/dashboard/GetDashboardUseCase';
import { ApiDashboardRepository } from '@infrastructure/repositories/ApiDashboardRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { LoginResponse } from '@domain/repositories/IAuthRepository';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardWithWorkspace | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardRepository = new ApiDashboardRepository();
  const getDashboardUseCase = new GetDashboardUseCase(dashboardRepository);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener workspace_id, user_id y sales_rep_id del storage
      const workspace_id = await SecureStorage.getWorkspaceId();
      const user_id = await SecureStorage.getUserId();
      const sales_rep_id = await SecureStorage.getSalesRepId();

      if (!workspace_id || !user_id || !sales_rep_id) {
        throw new Error('No se encontraron credenciales');
      }

      // Obtener avatar del user desde storage
      const userData = await SecureStorage.getUserData<LoginResponse>();
      setUserAvatar(userData?.user?.avatar || null);

      const result = await getDashboardUseCase.execute(workspace_id, user_id, sales_rep_id);
      setData(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar dashboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    data,
    userAvatar,
    loading,
    error,
    refresh: loadDashboard,
  };
};

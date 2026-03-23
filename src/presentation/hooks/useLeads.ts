import { useState, useEffect } from 'react';
import { GetLeadsUseCase } from '@application/usecases/leads/GetLeadsUseCase';
import { ApiLeadRepository } from '@infrastructure/repositories/ApiLeadRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { LeadListResponse } from '@domain/entities/Lead';

export const useLeads = () => {
  const [data, setData] = useState<LeadListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const leadRepository = new ApiLeadRepository();
  const getLeadsUseCase = new GetLeadsUseCase(leadRepository);

  const loadLeads = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      const sales_rep_id = await SecureStorage.getSalesRepId();


      if (!workspace_id || !sales_rep_id) {
        throw new Error('No se encontraron credenciales');
      }

      const result = await getLeadsUseCase.execute(workspace_id, sales_rep_id, pageNum, 20);
      
      setData(result);
      setPage(pageNum);
    } catch (err: any) {
      console.error('❌ Error loading leads:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar leads';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const nextPage = () => {
    if (data?.pagination.hasNext) {
      loadLeads(page + 1);
    }
  };

  const prevPage = () => {
    if (data?.pagination.hasPrev) {
      loadLeads(page - 1);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    refresh: () => loadLeads(page),
    nextPage,
    prevPage,
  };
};

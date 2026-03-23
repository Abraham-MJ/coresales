import { useState, useEffect } from 'react';
import { GetLeadByIdUseCase } from '@application/usecases/leads/GetLeadByIdUseCase';
import { ApiLeadRepository } from '@infrastructure/repositories/ApiLeadRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { Lead } from '@domain/entities/Lead';

export const useLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leadRepository = new ApiLeadRepository();
  const getLeadByIdUseCase = new GetLeadByIdUseCase(leadRepository);

  const loadLead = async () => {
    setLoading(true);
    setError(null);

    try {
      const workspace_id = await SecureStorage.getWorkspaceId();

      if (!workspace_id) {
        throw new Error('No se encontró workspace_id');
      }

      const result = await getLeadByIdUseCase.execute(leadId, workspace_id);
      setLead(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar lead';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId]);

  return {
    lead,
    loading,
    error,
    refresh: loadLead,
  };
};

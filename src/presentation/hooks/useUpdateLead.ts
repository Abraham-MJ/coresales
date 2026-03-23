import { useState } from 'react';
import { UpdateLeadUseCase } from '@application/usecases/leads/UpdateLeadUseCase';
import { ApiLeadRepository } from '@infrastructure/repositories/ApiLeadRepository';
import { Lead } from '@domain/entities/Lead';

export const useUpdateLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leadRepository = new ApiLeadRepository();
  const updateLeadUseCase = new UpdateLeadUseCase(leadRepository);

  const updateLead = async (leadId: string, formData: Record<string, any>): Promise<Lead | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateLeadUseCase.execute(leadId, formData);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar lead';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateLead,
    loading,
    error,
  };
};

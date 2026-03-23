import { useState } from 'react';
import { CreateLeadUseCase } from '@application/usecases/leads/CreateLeadUseCase';
import { ApiLeadRepository } from '@infrastructure/repositories/ApiLeadRepository';
import { ApiCatalogRepository } from '@infrastructure/repositories/ApiCatalogRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { CreateLeadDto, Lead } from '@domain/entities/Lead';

export const useCreateLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leadRepository = new ApiLeadRepository();
  const catalogRepository = new ApiCatalogRepository();
  const createLeadUseCase = new CreateLeadUseCase(leadRepository);

  const createLead = async (formData: Record<string, any>): Promise<Lead | null> => {
    setLoading(true);
    setError(null);

    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      const sales_rep_id = await SecureStorage.getSalesRepId();

      if (!workspace_id || !sales_rep_id) {
        throw new Error('No se encontraron credenciales');
      }

      // Si no hay lead_status_id, obtener el primer estado del pipeline
      if (!formData.lead_status_id) {
        const leadStatuses = await catalogRepository.getLeadStatuses(workspace_id);
        if (leadStatuses.length > 0) {
          formData.lead_status_id = leadStatuses[0].id;
        }
      }

      const leadData: CreateLeadDto = {
        workspace_id,
        sales_rep_id,
        ...formData,
      };

      const result = await createLeadUseCase.execute(leadData);
      
      return result;
    } catch (err: any) {
      console.error('❌ Error creating lead:', err);
      console.error('Response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear lead';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLead,
    loading,
    error,
  };
};

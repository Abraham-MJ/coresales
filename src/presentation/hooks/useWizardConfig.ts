import { useState, useEffect } from 'react';
import { GetWizardConfigUseCase } from '@application/usecases/wizard/GetWizardConfigUseCase';
import { ApiWizardRepository } from '@infrastructure/repositories/ApiWizardRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { WizardConfig } from '@domain/entities/WizardConfig';

export const useWizardConfig = (entity_type: 'lead' | 'client' | 'contract') => {
  const [config, setConfig] = useState<WizardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wizardRepository = new ApiWizardRepository();
  const getWizardConfigUseCase = new GetWizardConfigUseCase(wizardRepository);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);

    try {
      const workspace_id = await SecureStorage.getWorkspaceId();

      if (!workspace_id) {
        throw new Error('No se encontró workspace_id');
      }

      const result = await getWizardConfigUseCase.execute(workspace_id, entity_type);
      setConfig(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar configuración';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [entity_type]);

  return {
    config,
    loading,
    error,
    refresh: loadConfig,
  };
};

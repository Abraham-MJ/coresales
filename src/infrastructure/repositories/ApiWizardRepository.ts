import { IWizardRepository } from '@domain/repositories/IWizardRepository';
import { WizardConfig } from '@domain/entities/WizardConfig';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { ApiResponse } from '@shared/types/api.types';

export class ApiWizardRepository implements IWizardRepository {
  async getWizardConfig(workspace_id: string, entity_type: 'lead' | 'client' | 'contract'): Promise<WizardConfig> {
    const response = await apiClient.get<ApiResponse<WizardConfig>>(
      '/wizard-configs/default',
      {
        params: {
          workspace_id,
          entity_type,
        },
      }
    );

    return response.data.data;
  }
}

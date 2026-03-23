import { WizardConfig } from '../entities/WizardConfig';

export interface IWizardRepository {
  getWizardConfig(workspace_id: string, entity_type: 'lead' | 'client' | 'contract'): Promise<WizardConfig>;
}

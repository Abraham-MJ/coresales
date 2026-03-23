import { IWizardRepository } from '@domain/repositories/IWizardRepository';
import { WizardConfig } from '@domain/entities/WizardConfig';

export class GetWizardConfigUseCase {
  constructor(private wizardRepository: IWizardRepository) {}

  async execute(workspace_id: string, entity_type: 'lead' | 'client' | 'contract'): Promise<WizardConfig> {
    return await this.wizardRepository.getWizardConfig(workspace_id, entity_type);
  }
}

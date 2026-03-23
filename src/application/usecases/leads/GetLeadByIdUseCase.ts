import { ILeadRepository } from '@domain/repositories/ILeadRepository';
import { Lead } from '@domain/entities/Lead';

export class GetLeadByIdUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(id: string, workspace_id: string): Promise<Lead> {
    return await this.leadRepository.getLeadById(id, workspace_id);
  }
}

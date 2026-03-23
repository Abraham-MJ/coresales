import { ILeadRepository } from '@domain/repositories/ILeadRepository';
import { CreateLeadDto, Lead } from '@domain/entities/Lead';

export class UpdateLeadUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(id: string, data: Partial<CreateLeadDto>): Promise<Lead> {
    return await this.leadRepository.updateLead(id, data);
  }
}

import { ILeadRepository } from '@domain/repositories/ILeadRepository';
import { CreateLeadDto, Lead } from '@domain/entities/Lead';

export class CreateLeadUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(data: CreateLeadDto): Promise<Lead> {
    return await this.leadRepository.createLead(data);
  }
}

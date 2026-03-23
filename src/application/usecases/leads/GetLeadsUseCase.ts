import { ILeadRepository } from '@domain/repositories/ILeadRepository';
import { LeadListResponse } from '@domain/entities/Lead';

export class GetLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(workspace_id: string, sales_rep_id: string, page: number = 1, limit: number = 20): Promise<LeadListResponse> {
    return await this.leadRepository.getLeads(workspace_id, sales_rep_id, page, limit);
  }
}

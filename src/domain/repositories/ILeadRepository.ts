import { Lead, CreateLeadDto, LeadListResponse } from '../entities/Lead';

export interface ILeadRepository {
  getLeads(workspace_id: string, sales_rep_id: string, page: number, limit: number): Promise<LeadListResponse>;
  getLeadById(id: string, workspace_id: string): Promise<Lead>;
  createLead(data: CreateLeadDto): Promise<Lead>;
  updateLead(id: string, data: Partial<CreateLeadDto>): Promise<Lead>;
}

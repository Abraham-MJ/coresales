import { ILeadRepository } from '@domain/repositories/ILeadRepository';
import { Lead, CreateLeadDto, LeadListResponse } from '@domain/entities/Lead';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { ApiResponse } from '@shared/types/api.types';

export class ApiLeadRepository implements ILeadRepository {
  async getLeads(workspace_id: string, sales_rep_id: string, page: number = 1, limit: number = 20): Promise<LeadListResponse> {
    const response = await apiClient.get<ApiResponse<LeadListResponse>>(
      '/leads',
      {
        params: {
          workspace_id,
          sales_rep_id,
          page,
          limit,
          sort: 'created_at',
          order: 'desc',
        },
      }
    );

    return response.data.data;
  }

  async getLeadById(id: string, workspace_id: string): Promise<Lead> {
    const response = await apiClient.get<ApiResponse<Lead>>(
      `/leads/${id}`,
      {
        params: { workspace_id },
      }
    );

    return response.data.data;
  }

  async createLead(data: CreateLeadDto): Promise<Lead> {
    const response = await apiClient.post<ApiResponse<Lead>>(
      '/leads',
      data
    );

    return response.data.data;
  }

  async updateLead(id: string, data: Partial<CreateLeadDto>): Promise<Lead> {
    const response = await apiClient.put<ApiResponse<Lead>>(
      `/leads/${id}`,
      data
    );

    return response.data.data;
  }
}

import { ICatalogRepository } from '@domain/repositories/ICatalogRepository';
import { IspPlan, Product, LeadStatus } from '@domain/entities/Catalog';
import { SalesRep } from '@domain/entities/User';
import { Branch, Zone } from '@domain/entities/Sale';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { ApiResponse } from '@shared/types/api.types';

export class ApiCatalogRepository implements ICatalogRepository {
  async getIspPlans(workspace_id: string): Promise<IspPlan[]> {
    const response = await apiClient.get<ApiResponse<IspPlan[]>>(
      '/isp-plans',
      { params: { workspace_id } }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }

  async getProducts(workspace_id: string): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products',
      { params: { workspace_id } }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }

  async getLeadStatuses(workspace_id: string): Promise<LeadStatus[]> {
    const response = await apiClient.get<ApiResponse<LeadStatus[]>>(
      '/lead-statuses',
      { params: { workspace_id } }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }

  async getSalesReps(workspace_id: string): Promise<SalesRep[]> {
    const response = await apiClient.get<ApiResponse<SalesRep[]>>(
      '/sales-reps',
      { params: { workspace_id, with_user_info: true } }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }

  async getBranches(workspace_id: string): Promise<Branch[]> {
    const response = await apiClient.get<ApiResponse<Branch[]>>(
      '/branches',
      { params: { workspace_id } }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }

  async getZones(workspace_id: string, branch_id?: string): Promise<Zone[]> {
    const params: any = { workspace_id };
    if (branch_id) {
      params.branch_id = branch_id;
    }
    
    const response = await apiClient.get<ApiResponse<Zone[]>>(
      '/zones',
      { params }
    );
    const data = response.data.data;
    return Array.isArray(data) ? data : (data as any)?.items || [];
  }
}

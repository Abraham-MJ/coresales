import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import { Sale, CreateSaleDto } from '../../domain/entities/Sale';
import { apiClient } from '../api/client/ApiClient';

export class ApiSaleRepository implements ISaleRepository {
  async getSales(workspaceId: string, salesRepId: string, page: number = 1, limit: number = 20): Promise<any> {
    const response = await apiClient.get('/sales', {
      params: {
        workspace_id: workspaceId,
        sales_rep_id: salesRepId,
        page,
        limit,
        sort: 'sale_date',
        order: 'desc',
      },
    });
    return response.data;
  }

  async createSale(data: CreateSaleDto): Promise<Sale> {
    const response = await apiClient.post<Sale>('/sales', data);
    return response.data;
  }
}

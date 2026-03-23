import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { Client, CreateClientDto, FieldMapping } from '../../domain/entities/Client';
import { apiClient } from '../api/client/ApiClient';

export class ApiClientRepository implements IClientRepository {
  async searchByDocument(workspaceId: string, documentNumber: string, documentType?: string): Promise<Client | null> {
    const params: any = {
      workspace_id: workspaceId,
      document_number: documentNumber,
    };
    
    if (documentType) {
      params.document_type = documentType;
    }

    const response = await apiClient.get<any>('/clients/by-document', { params });
    
    if (response.data && response.data.data === null) {
      return null;
    }
    
    return response.data.data || response.data || null;
  }

  async createClient(data: CreateClientDto): Promise<Client> {
    const response = await apiClient.post<Client>('/clients', data);
    return response.data;
  }

  async getFieldMappings(workspaceId: string): Promise<FieldMapping[]> {
    const response = await apiClient.get<{ mappings: FieldMapping[] }>('/flow-automation/lead/client', {
      params: { workspace_id: workspaceId }
    });
    return response.data.mappings;
  }
}

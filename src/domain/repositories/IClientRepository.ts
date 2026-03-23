import { Client, CreateClientDto, FieldMapping } from '../entities/Client';

export interface IClientRepository {
  searchByDocument(workspaceId: string, documentNumber: string, documentType?: string): Promise<Client | null>;
  createClient(data: CreateClientDto): Promise<Client>;
  getFieldMappings(workspaceId: string): Promise<FieldMapping[]>;
}

import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class SearchClientByDocumentUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(workspaceId: string, documentNumber: string, documentType?: string): Promise<Client | null> {
    return this.clientRepository.searchByDocument(workspaceId, documentNumber, documentType);
  }
}

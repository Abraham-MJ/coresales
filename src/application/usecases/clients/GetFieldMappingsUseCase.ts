import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { FieldMapping } from '../../../domain/entities/Client';

export class GetFieldMappingsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(workspaceId: string): Promise<FieldMapping[]> {
    return this.clientRepository.getFieldMappings(workspaceId);
  }
}

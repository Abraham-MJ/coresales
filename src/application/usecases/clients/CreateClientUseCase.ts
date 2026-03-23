import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client, CreateClientDto } from '../../../domain/entities/Client';

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: CreateClientDto): Promise<Client> {
    return this.clientRepository.createClient(data);
  }
}

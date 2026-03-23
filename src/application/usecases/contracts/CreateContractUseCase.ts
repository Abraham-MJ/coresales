import { IContractRepository } from '../../../domain/repositories/IContractRepository';
import { Contract, CreateContractDto } from '../../../domain/entities/Contract';

export class CreateContractUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute(data: CreateContractDto): Promise<Contract> {
    return this.contractRepository.createContract(data);
  }
}

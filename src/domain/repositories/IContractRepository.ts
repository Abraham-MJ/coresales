import { Contract, CreateContractDto } from '../entities/Contract';

export interface IContractRepository {
  createContract(data: CreateContractDto): Promise<Contract>;
}

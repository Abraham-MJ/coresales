import { IContractRepository } from '../../domain/repositories/IContractRepository';
import { Contract, CreateContractDto } from '../../domain/entities/Contract';
import { apiClient } from '../api/client/ApiClient';

export class ApiContractRepository implements IContractRepository {
  async createContract(data: CreateContractDto): Promise<Contract> {
    const response = await apiClient.post<Contract>('/contracts', data);
    return response.data;
  }
}

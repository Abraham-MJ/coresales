import { useState } from 'react';
import { Contract, CreateContractDto } from '../../domain/entities/Contract';
import { CreateContractUseCase } from '../../application/usecases/contracts/CreateContractUseCase';
import { ApiContractRepository } from '../../infrastructure/repositories/ApiContractRepository';

const repository = new ApiContractRepository();
const useCase = new CreateContractUseCase(repository);

export const useCreateContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContract = async (data: CreateContractDto): Promise<Contract | null> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await useCase.execute(data);
      return contract;
    } catch (err: any) {
      setError(err.message || 'Error creando contrato');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createContract };
};

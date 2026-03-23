import { useState } from 'react';
import { Client, CreateClientDto } from '../../domain/entities/Client';
import { CreateClientUseCase } from '../../application/usecases/clients/CreateClientUseCase';
import { GetFieldMappingsUseCase } from '../../application/usecases/clients/GetFieldMappingsUseCase';
import { ApiClientRepository } from '../../infrastructure/repositories/ApiClientRepository';

const repository = new ApiClientRepository();
const createUseCase = new CreateClientUseCase(repository);
const mappingsUseCase = new GetFieldMappingsUseCase(repository);

export const useCreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: CreateClientDto): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const client = await createUseCase.execute(data);
      return client;
    } catch (err: any) {
      setError(err.message || 'Error creando cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFieldMappings = async (workspaceId: string) => {
    try {
      return await mappingsUseCase.execute(workspaceId);
    } catch (err: any) {
      console.error('Error obteniendo mapeos:', err);
      return [];
    }
  };

  return { loading, error, createClient, getFieldMappings };
};

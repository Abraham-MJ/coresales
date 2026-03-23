import { useState } from 'react';
import { Client } from '../../domain/entities/Client';
import { SearchClientByDocumentUseCase } from '../../application/usecases/clients/SearchClientByDocumentUseCase';
import { ApiClientRepository } from '../../infrastructure/repositories/ApiClientRepository';

const repository = new ApiClientRepository();
const useCase = new SearchClientByDocumentUseCase(repository);

export const useSearchClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const searchByDocument = async (workspaceId: string, documentNumber: string, documentType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await useCase.execute(workspaceId, documentNumber, documentType);
      setClient(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error buscando cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setClient(null);
    setError(null);
  };

  return { client, loading, error, searchByDocument, reset };
};

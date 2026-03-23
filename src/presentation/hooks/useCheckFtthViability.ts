import { useState } from 'react';
import { CheckFtthViabilityUseCase } from '../../application/usecases/ftth/CheckFtthViabilityUseCase';
import { ApiFtthRepository } from '../../infrastructure/repositories/ApiFtthRepository';

const repository = new ApiFtthRepository();
const checkViabilityUseCase = new CheckFtthViabilityUseCase(repository);

export const useCheckFtthViability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkViability = async (workspaceId: string, lat: number, lng: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await checkViabilityUseCase.execute(workspaceId, lat, lng);
      return result.hasViability;
    } catch (err: any) {
      setError(err.message || 'Error verificando cobertura');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, checkViability };
};

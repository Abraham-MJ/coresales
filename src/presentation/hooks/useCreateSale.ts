import { useState } from 'react';
import { Sale, CreateSaleDto } from '../../domain/entities/Sale';
import { CreateSaleUseCase } from '../../application/usecases/sales/CreateSaleUseCase';
import { ApiSaleRepository } from '../../infrastructure/repositories/ApiSaleRepository';

const repository = new ApiSaleRepository();
const useCase = new CreateSaleUseCase(repository);

export const useCreateSale = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSale = async (data: CreateSaleDto): Promise<Sale | null> => {
    setLoading(true);
    setError(null);
    try {
      const sale = await useCase.execute(data);
      return sale;
    } catch (err: any) {
      setError(err.message || 'Error creando venta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createSale };
};

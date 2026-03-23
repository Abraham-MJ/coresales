import { useState, useEffect } from 'react';
import { ApiSaleRepository } from '@infrastructure/repositories/ApiSaleRepository';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';

export interface SaleListResponse {
  items: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useSales = () => {
  const [data, setData] = useState<SaleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const saleRepository = new ApiSaleRepository();

  const loadSales = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const workspace_id = await SecureStorage.getWorkspaceId();
      const sales_rep_id = await SecureStorage.getSalesRepId();

      if (!workspace_id || !sales_rep_id) {
        throw new Error('No se encontraron credenciales');
      }

      const result = await saleRepository.getSales(workspace_id, sales_rep_id, pageNum, 20);
      
      setData(result);
      setPage(pageNum);
    } catch (err: any) {
      console.error('❌ Error loading sales:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar ventas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const nextPage = () => {
    if (data?.pagination.hasNext) {
      loadSales(page + 1);
    }
  };

  const prevPage = () => {
    if (data?.pagination.hasPrev) {
      loadSales(page - 1);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    refresh: () => loadSales(page),
    nextPage,
    prevPage,
  };
};

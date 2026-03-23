import { useState, useEffect } from 'react';
import { Branch, Zone } from '../../domain/entities/Sale';
import { ApiCatalogRepository } from '../../infrastructure/repositories/ApiCatalogRepository';
import { SecureStorage } from '../../infrastructure/storage/SecureStorage';
import { STORAGE_KEYS } from '@shared/constants/api.constants';

const repository = new ApiCatalogRepository();

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const workspaceId = await SecureStorage.getItem(STORAGE_KEYS.WORKSPACE_ID);
      if (!workspaceId) throw new Error('No workspace ID');
      
      const data = await repository.getBranches(workspaceId);
      setBranches(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando sucursales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  return { branches, loading, error, reload: loadBranches };
};

export const useZones = (branchId?: string) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadZones = async (selectedBranchId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const workspaceId = await SecureStorage.getItem(STORAGE_KEYS.WORKSPACE_ID);
      if (!workspaceId) throw new Error('No workspace ID');
      
      const data = await repository.getZones(workspaceId, selectedBranchId || branchId);
      setZones(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando zonas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) {
      loadZones(branchId);
    }
  }, [branchId]);

  return { zones, loading, error, loadZones };
};

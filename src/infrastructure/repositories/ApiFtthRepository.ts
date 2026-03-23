import { IFtthRepository, FtthViability } from '../../domain/repositories/IFtthRepository';
import { apiClient } from '../api/client/ApiClient';

export class ApiFtthRepository implements IFtthRepository {
  async checkViability(workspaceId: string, lat: number, lng: number, radius: number = 700): Promise<FtthViability[]> {
    const response = await apiClient.get<any>('/ftth/viability', {
      params: {
        workspace_id: workspaceId,
        lat,
        lng,
        radius,
      },
    });

    if (response.data.status === 'success' && response.data.data) {
      return response.data.data.map((nap: any) => ({
        id: nap.id,
        name: nap.name || nap.label,
        distance: nap.distance || 0,
        availablePorts: nap.availablePorts || 0,
      }));
    }

    return [];
  }
}

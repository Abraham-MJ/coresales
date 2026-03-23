import { IFtthRepository, FtthViability } from '../../domain/repositories/IFtthRepository';

export class CheckFtthViabilityUseCase {
  constructor(private repository: IFtthRepository) {}

  async execute(workspaceId: string, lat: number, lng: number, radius?: number): Promise<{ hasViability: boolean; napsCount: number }> {
    const naps = await this.repository.checkViability(workspaceId, lat, lng, radius);
    return {
      hasViability: naps.length > 0,
      napsCount: naps.length
    };
  }
}

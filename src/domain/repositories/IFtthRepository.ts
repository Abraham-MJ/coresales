export interface FtthViability {
  id: string;
  name: string;
  distance: number;
  availablePorts: number;
}

export interface IFtthRepository {
  checkViability(workspaceId: string, lat: number, lng: number, radius?: number): Promise<FtthViability[]>;
}

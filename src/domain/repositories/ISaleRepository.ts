import { Sale, CreateSaleDto } from '../entities/Sale';

export interface ISaleRepository {
  createSale(data: CreateSaleDto): Promise<Sale>;
}

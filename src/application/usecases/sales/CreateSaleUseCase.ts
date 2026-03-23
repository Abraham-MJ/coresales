import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { Sale, CreateSaleDto } from '../../../domain/entities/Sale';

export class CreateSaleUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(data: CreateSaleDto): Promise<Sale> {
    return this.saleRepository.createSale(data);
  }
}

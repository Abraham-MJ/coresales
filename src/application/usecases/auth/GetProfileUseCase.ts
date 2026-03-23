import { IAuthRepository, LoginResponse } from '@domain/repositories/IAuthRepository';

export class GetProfileUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<LoginResponse | null> {
    return await this.authRepository.getAuthData();
  }
}

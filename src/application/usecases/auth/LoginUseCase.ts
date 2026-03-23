import { IAuthRepository, LoginCredentials, LoginResponse } from '@domain/repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<LoginResponse> {
    // 1. Login
    const user = await this.authRepository.login(credentials);

    // 2. Obtener perfil de vendedor
    const salesRep = await this.authRepository.getSalesRepProfile(
      user.workspace_id,
      user.id
    );

    // 3. Guardar datos completos
    await this.authRepository.saveAuthData(user, salesRep);

    return { user, salesRep };
  }
}

import { IAuthRepository, LoginCredentials, LoginResponse } from '@domain/repositories/IAuthRepository';
import { SalesRep, User } from '@domain/entities/User';
import { apiClient } from '@infrastructure/api/client/ApiClient';
import { SecureStorage } from '@infrastructure/storage/SecureStorage';
import { ENDPOINTS } from '@shared/constants/api.constants';
import { ApiResponse } from '@shared/types/api.types';

export class ApiAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const user = response.data.data;

    // Guardar token y datos básicos
    await SecureStorage.saveToken(user.token);
    await SecureStorage.saveWorkspaceId(user.workspace_id);
    await SecureStorage.saveUserId(user.id);

    return user;
  }

  async getSalesRepProfile(workspace_id: string, user_id: string): Promise<SalesRep> {
    const response = await apiClient.get<ApiResponse<SalesRep>>(
      ENDPOINTS.SALES_REPS.ME,
      {
        params: { workspace_id, user_id },
      }
    );

    const salesRep = response.data.data;

    // Guardar sales_rep_id
    await SecureStorage.saveSalesRepId(salesRep.id);

    return salesRep;
  }

  async logout(): Promise<void> {
    await this.clearAuthData();
  }

  async saveAuthData(user: User, salesRep?: SalesRep): Promise<void> {
    await SecureStorage.saveUserData({ user, salesRep });
  }

  async getAuthData(): Promise<LoginResponse | null> {
    const data = await SecureStorage.getUserData<LoginResponse>();
    return data;
  }

  async clearAuthData(): Promise<void> {
    await SecureStorage.clearAuthData();
  }
}

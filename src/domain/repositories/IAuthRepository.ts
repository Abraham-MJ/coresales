import { SalesRep, User } from '../entities/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  salesRep?: SalesRep;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  getSalesRepProfile(workspace_id: string, user_id: string): Promise<SalesRep>;
  logout(): Promise<void>;
  saveAuthData(user: User, salesRep?: SalesRep): Promise<void>;
  getAuthData(): Promise<LoginResponse | null>;
  clearAuthData(): Promise<void>;
}

import { useState } from 'react';
import { LoginUseCase } from '@application/usecases/auth/LoginUseCase';
import { ApiAuthRepository } from '@infrastructure/repositories/ApiAuthRepository';
import { LoginCredentials, LoginResponse } from '@domain/repositories/IAuthRepository';

interface AuthError {
  field: 'email' | 'password' | 'general';
  message: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const authRepository = new ApiAuthRepository();
  const loginUseCase = new LoginUseCase(authRepository);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(credentials);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      
      // Mapear errores específicos según la documentación
      let authError: AuthError = { field: 'general', message: errorMessage };

      if (errorMessage.includes('Email not registered')) {
        authError = { field: 'email', message: 'Este correo no está registrado' };
      } else if (errorMessage.includes('Invalid password')) {
        authError = { field: 'password', message: 'Contraseña incorrecta' };
      } else if (errorMessage.includes('Account deactivated')) {
        authError = { field: 'email', message: 'Cuenta desactivada' };
      } else if (errorMessage.includes('Email and password are required')) {
        authError = { field: 'general', message: 'Email y contraseña son requeridos' };
      }

      setError(authError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authRepository.logout();
  };

  const getAuthData = async (): Promise<LoginResponse | null> => {
    return await authRepository.getAuthData();
  };

  return {
    login,
    logout,
    getAuthData,
    loading,
    error,
  };
};

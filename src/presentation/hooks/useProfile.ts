import { useState, useEffect } from 'react';
import { GetProfileUseCase } from '@application/usecases/auth/GetProfileUseCase';
import { LogoutUseCase } from '@application/usecases/auth/LogoutUseCase';
import { ApiAuthRepository } from '@infrastructure/repositories/ApiAuthRepository';
import { LoginResponse } from '@domain/repositories/IAuthRepository';

export const useProfile = () => {
  const [data, setData] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const authRepository = new ApiAuthRepository();
  const getProfileUseCase = new GetProfileUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await getProfileUseCase.execute();
      setData(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUseCase.execute();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { data, loading, logout };
};

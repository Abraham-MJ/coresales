import { useState } from 'react';
import { UploadFileUseCase, GenerateOtpUseCase, VerifyOtpUseCase } from '../../application/usecases/files/FileUseCases';
import { ApiFileRepository, ApiOtpRepository } from '../../infrastructure/repositories/ApiFileRepository';

const fileRepository = new ApiFileRepository();
const otpRepository = new ApiOtpRepository();

const uploadUseCase = new UploadFileUseCase(fileRepository);
const generateOtpUseCase = new GenerateOtpUseCase(otpRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(otpRepository);

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File | Blob, workspaceId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const url = await uploadUseCase.execute(file, workspaceId);
      return url;
    } catch (err: any) {
      setError(err.message || 'Error subiendo archivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, uploadFile };
};

export const useOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOtp = async (
    email: string,
    purpose: string,
    userName?: string,
    workspaceId?: string,
    referenceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateOtpUseCase.execute(email, purpose, userName, workspaceId, referenceId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error generando OTP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string,
    purpose: string,
    referenceId?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const verified = await verifyOtpUseCase.execute(email, otp, purpose, referenceId);
      return verified;
    } catch (err: any) {
      setError(err.message || 'Error verificando OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, generateOtp, verifyOtp };
};

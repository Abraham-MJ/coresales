import { IFileRepository, IOtpRepository } from '../../../domain/repositories/IFileRepository';

export class UploadFileUseCase {
  constructor(private fileRepository: IFileRepository) {}

  async execute(file: File | Blob, workspaceId: string): Promise<string> {
    return this.fileRepository.uploadFile(file, workspaceId);
  }
}

export class GenerateOtpUseCase {
  constructor(private otpRepository: IOtpRepository) {}

  async execute(
    email: string,
    purpose: string,
    userName?: string,
    workspaceId?: string,
    referenceId?: string
  ): Promise<{ expires_at: string }> {
    return this.otpRepository.generateOtp(email, purpose, userName, workspaceId, referenceId);
  }
}

export class VerifyOtpUseCase {
  constructor(private otpRepository: IOtpRepository) {}

  async execute(
    email: string,
    otp: string,
    purpose: string,
    referenceId?: string
  ): Promise<boolean> {
    return this.otpRepository.verifyOtp(email, otp, purpose, referenceId);
  }
}

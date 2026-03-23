export interface IFileRepository {
  uploadFile(file: File | Blob, workspaceId: string): Promise<string>;
}

export interface IOtpRepository {
  generateOtp(email: string, purpose: string, userName?: string, workspaceId?: string, referenceId?: string): Promise<{ expires_at: string }>;
  verifyOtp(email: string, otp: string, purpose: string, referenceId?: string): Promise<boolean>;
}

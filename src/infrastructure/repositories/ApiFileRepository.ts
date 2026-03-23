import { IFileRepository, IOtpRepository } from '../../domain/repositories/IFileRepository';
import { apiClient } from '../api/client/ApiClient';

export class ApiFileRepository implements IFileRepository {
  async uploadFile(file: File | Blob, workspaceId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspace_id', workspaceId);

    const response = await apiClient.post<{ url: string }>('/s3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }
}

export class ApiOtpRepository implements IOtpRepository {
  async generateOtp(
    email: string,
    purpose: string,
    userName?: string,
    workspaceId?: string,
    referenceId?: string
  ): Promise<{ expires_at: string }> {
    const response = await apiClient.post<{ expires_at: string }>('/otp/generate', {
      email,
      purpose,
      user_name: userName,
      workspace_id: workspaceId,
      reference_id: referenceId,
      reference_type: purpose === 'contract_sign' ? 'contract' : 'general',
    });

    return response.data;
  }

  async verifyOtp(
    email: string,
    otp: string,
    purpose: string,
    referenceId?: string
  ): Promise<boolean> {
    const response = await apiClient.post<{ verified: boolean }>('/otp/verify', {
      email,
      otp,
      purpose,
      reference_id: referenceId,
      mark_used: true,
    });

    return response.data.verified;
  }
}

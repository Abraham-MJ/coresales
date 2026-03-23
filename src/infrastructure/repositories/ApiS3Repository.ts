import { API_CONFIG } from '@/src/shared/constants/api.constants';
import { SecureStorage } from '../storage/SecureStorage';

export class ApiS3Repository {
  private baseUrl = API_CONFIG.BASE_URL;

  async uploadFile(formData: FormData): Promise<{ url: string }> {
    const token = await SecureStorage.getToken();
    
    const response = await fetch(`${this.baseUrl}/s3/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir archivo');
    }

    const result = await response.json();
    return result.data;
  }
}

import { useState } from 'react';
import { ApiS3Repository } from '../../infrastructure/repositories/ApiS3Repository';

const s3Repository = new ApiS3Repository();

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    workspaceId: string,
    base64Data: string,
    fileName: string = 'signature.png'
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Convertir base64 a blob
      const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const byteCharacters = atob(base64WithoutPrefix);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Crear FormData
      const formData = new FormData();
      formData.append('file', blob as any, fileName);
      formData.append('workspace_id', workspaceId);

      const result = await s3Repository.uploadFile(formData);
      return result.url;
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error };
};

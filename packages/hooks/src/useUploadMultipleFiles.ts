import { useState } from 'react';
import { useS3 } from './useS3';

export const useUploadMultipleFiles = (bucket: string) => {
  const { upload, getPublicUrl } = useS3();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: File[], basePath: string) => {
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => {
        const timestamp = new Date().toISOString();
        const uniqueFileName = `${timestamp}-${file.name}`;
        const filePath = `${basePath}/${uniqueFileName}`;
        return upload(bucket, filePath, file).then(data => getPublicUrl(bucket, data.path));
      });

      const urls = await Promise.all(uploadPromises);
      setUploading(false);
      return urls;
    } catch (e: any) {
      setError(e.message);
      setUploading(false);
      return [];
    }
  };

  return { uploadFiles, uploading, error };
};

import { useMutation } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { v4 as uuidv4 } from 'uuid';

export const useUploadImages = () => {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (files: File[]) => {
      if (!supabase) throw new Error('Supabase client not available');
      if (!files || files.length === 0) return [];

      const uploadPromises = files.map(file => {
        const fileName = `${uuidv4()}-${file.name}`;
        return supabase.storage.from('vehicle-images').upload(fileName, file);
      });

      const results = await Promise.all(uploadPromises);
      
      const uploadedImageUrls: string[] = [];
      for (const result of results) {
        if (result.error) {
          console.error('Error uploading image:', result.error);
          throw result.error;
        }
        if (result.data?.path) {
            const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(result.data.path);
            uploadedImageUrls.push(publicUrl);
        }
      }

      return uploadedImageUrls;
    },
  });
};

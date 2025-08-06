import { getSupabaseClient } from './client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImages(files: (File | string)[], bucket: string, path: string): Promise<string[]> {
  const supabase = getSupabase();
  const urls: string[] = [];
  
  // Separate new files from existing URLs
  const newFiles = files.filter(f => f instanceof File) as File[];
  const existingUrls = files.filter(f => typeof f === 'string') as string[];

  for (const file of newFiles) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    urls.push(publicUrl);
  }

  // Return existing URLs along with newly uploaded ones
  return [...existingUrls, ...urls];
}

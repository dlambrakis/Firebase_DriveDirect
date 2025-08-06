import { getSupabaseClient } from './client';
import { Vehicle, CreateVehicleInput } from '@directdrive/core-types';
import { v4 as uuidv4 } from 'uuid';

// This is the type the useCreateVehicle hook will use.
export type CreateVehicleApiPayload = Omit<CreateVehicleInput, 'makeId' | 'modelId' | 'variantId' | 'provinceId' | 'cityId' | 'suburbId' | 'featureIds' | 'images'> & {
  user_id: string;
  make_id: string;
  model_id: string;
  variant_id: string;
  province_id: string;
  city_id: string;
  suburb_id: string;
  feature_ids?: string[];
  images: File[]; // Expect raw files
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const supabase = getSupabase();
  const uploadPromises = files.map(file => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    return supabase.storage.from('vehicle-images').upload(filePath, file);
  });

  const uploadResults = await Promise.all(uploadPromises);

  const urls: string[] = [];
  for (const result of uploadResults) {
    if (result.error) {
      console.error('Error uploading image:', result.error);
      throw new Error(`Failed to upload one or more images: ${result.error.message}`);
    }
    const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(result.data.path);
    urls.push(publicUrl);
  }

  return urls;
};

export const createVehicle = async (vehicleData: CreateVehicleApiPayload): Promise<Vehicle | null> => {
  const { images, feature_ids, ...restOfVehicleData } = vehicleData;
  const supabase = getSupabase();

  const imageUrls = await uploadImages(images);

  const vehicleInsertPayload = {
    ...restOfVehicleData,
    images: imageUrls,
  };

  const { data: newVehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .insert(vehicleInsertPayload)
    .select()
    .single();

  if (vehicleError) {
    console.error('Error creating vehicle:', vehicleError);
    if (imageUrls.length > 0) {
      const filePaths = imageUrls.map(url => new URL(url).pathname.split('/vehicle-images/')[1]);
      await supabase.storage.from('vehicle-images').remove(filePaths);
    }
    throw vehicleError;
  }

  if (!newVehicle) {
    return null;
  }

  if (feature_ids && feature_ids.length > 0) {
    const featuresToInsert = feature_ids.map(feature_id => ({
      vehicle_id: newVehicle.id,
      feature_id: feature_id,
    }));

    const { error: featuresError } = await supabase
      .from('vehicle_features')
      .insert(featuresToInsert);

    if (featuresError) {
      console.error('Error adding vehicle features:', featuresError);
    }
  }

  return newVehicle;
};

export const fetchData = async <T>(table: string, columns: string, match: object): Promise<T[]> => {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select(columns)
    .match(match);
  
  if (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }
  
  return (data as T[]) || [];
};

export const deleteData = async (table: string, match: any) => {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).delete().match(match);
  if (error) {
    console.error(`Error deleting data from ${table}:`, error);
    throw error;
  }
}
export const updateVehicle = async (_payload: any) => { return { data: null, error: null }; }

export const callRpc = async (fn: string, params: any) => {
  const supabase = getSupabase();
  
  // The Supabase client automatically filters out undefined params,
  // so we can pass them directly.
  const { data, error } = await supabase.rpc(fn, params);

  if (error) {
    console.error(`Error calling RPC function "${fn}":`, error);
  }
  
  return { data, error };
}

export const subscribeToChanges = () => { return null; }
export const removeSubscription = () => {}
export type RealtimeSubscription = any;

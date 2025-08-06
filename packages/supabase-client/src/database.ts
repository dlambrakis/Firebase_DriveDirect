import { getSupabaseClient } from './client.js';
import { PostgrestError } from '@supabase/supabase-js';
import type { TableName, Tables, TablesInsert, TablesUpdate } from './types.js';

export async function fetchData<T extends TableName>(
  table: T,
  select: string = '*'
): Promise<{ data: Tables<T>[] | null; error: PostgrestError | null }> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).select(select);
  return { data: data as Tables<T>[] | null, error };
}

/**
 * Inserts an array of records into a table.
 * @returns A promise that resolves to an array of the inserted records, or null on error.
 */
export async function insertData<T extends TableName>(
  table: T,
  records: TablesInsert<T>[]
): Promise<Tables<T>[] | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from(table) as any)
    .insert(records)
    .select();

  if (error) {
    console.error(`Insert Error into ${table}:`, error);
    return null;
  }
  return data;
}

/**
 * Updates a single record in a table by its ID.
 * @returns A promise that resolves to an array containing the updated record, or null on error.
 */
export async function updateData<T extends TableName>(
  table: T,
  id: string,
  record: TablesUpdate<T>
): Promise<Tables<T>[] | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from(table) as any)
    .update(record)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Update Error in ${table}:`, error);
    return null;
  }
  return data;
}

export async function deleteData<T extends TableName>(
  table: T,
  id: string
): Promise<{ error: PostgrestError | null }> {
  const supabase = getSupabase();
  const { error } = await (supabase.from(table) as any)
    .delete()
    .eq('id', id);
  return { error };
}

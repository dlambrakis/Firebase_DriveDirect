import { getSupabase } from './singleton'; // Corrected: Import from the singleton
import { Database } from '@directdrive/core-types';

// Extract the Functions type from the generated Database type
type DbFunctions = Database['public']['Functions'];

export const callRpc = async <T extends keyof DbFunctions>(
  functionName: T,
  params: DbFunctions[T]['Args']
): Promise<DbFunctions[T]['Returns']> => {
  const supabase = getSupabase(); // Correct: Use the singleton getter

  // Assert the functionName as a key of the RPC definitions
  const { data, error } = await supabase.rpc(
    functionName as keyof DbFunctions,
    params
  );

  if (error) {
    console.error(`Error calling RPC function "${String(functionName)}":`, error);
    throw new Error(error.message);
  }

  return data;
};

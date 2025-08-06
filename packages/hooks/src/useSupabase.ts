import React, { createContext, useContext } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@directdrive/core-types';

// Define the type for our specific Supabase client
export type DirectDriveSupabaseClient = SupabaseClient<Database>;

// Create a context to hold the Supabase client
const SupabaseContext = createContext<DirectDriveSupabaseClient | null>(null);

// Create a provider component
interface SupabaseProviderProps {
  children: React.ReactNode;
  client: DirectDriveSupabaseClient;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children, client }) => {
  // Replace JSX with React.createElement to be valid in a .ts file
  return React.createElement(SupabaseContext.Provider, { value: client }, children);
};

// Create a hook to easily access the client
export const useSupabase = (): DirectDriveSupabaseClient => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

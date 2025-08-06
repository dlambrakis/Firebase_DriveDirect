import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// The import path has been corrected to point to the 'providers' directory.
import { AuthProvider } from './providers/AuthProvider.tsx';

// 1. Import the singleton initializer
import { initializeSupabaseSingleton } from '@directdrive/supabase-client/singleton';

// 2. Initialize Supabase at the application's entry point BEFORE rendering.
// This ensures the client is available for all subsequent code.
const supabase = initializeSupabaseSingleton(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* 3. Pass the initialized client to the provider */}
        <AuthProvider supabase={supabase}>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

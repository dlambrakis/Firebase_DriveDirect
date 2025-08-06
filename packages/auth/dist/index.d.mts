import React, { ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
}
interface AuthProviderProps {
    children: ReactNode;
}
declare const AuthProvider: React.FC<AuthProviderProps>;

declare const useAuth: () => AuthContextType;

export { type AuthContextType, AuthProvider, useAuth };

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';
// The type has been corrected to UserAttributes as suggested by the error
import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  UserAttributes,
} from '@supabase/supabase-js';

// Sign-in hook
const signIn = async (credentials: SignInWithPasswordCredentials) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw error;
  return data;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Sign-in error:', error.message);
    },
  });
};

// Sign-up hook
const signUp = async (credentials: SignUpWithPasswordCredentials) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) throw error;
  return data;
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data.session) {
        queryClient.setQueryData(['session'], data.session);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error) => {
      console.error('Sign-up error:', error.message);
    },
  });
};

// Sign-out hook
const signOut = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Sign-out error:', error.message);
    },
  });
};

// Forgot Password hook
const forgotPassword = async (email: string) => {
  const supabase = getSupabase();
  const redirectTo = `${
    process.env.EXPO_PUBLIC_WEB_URL || window.location.origin
  }/update-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      console.error('Forgot password error:', error.message);
    },
  });
};

// Update Password hook
const updatePassword = async (credentials: UserAttributes) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.updateUser(credentials);
  if (error) throw error;
  return data;
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error) => {
      console.error('Update password error:', error.message);
    },
  });
};

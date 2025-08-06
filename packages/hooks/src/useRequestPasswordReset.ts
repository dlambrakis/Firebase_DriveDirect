import { useMutation } from '@tanstack/react-query';
import { getSupabase } from '@directdrive/supabase-client/singleton';

interface RequestPasswordResetVariables {
  email: string;
  redirectTo: string;
}

export const useRequestPasswordReset = () => {
  const supabase = getSupabase();

  return useMutation<void, Error, RequestPasswordResetVariables>({
    mutationFn: async ({ email, redirectTo }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        throw error;
      }
    },
  });
};

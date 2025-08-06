import React, { useState, useEffect } from 'react';
import { useUpdatePassword, useAuth } from '@directdrive/hooks';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
} from '@directdrive/ui';
import LoadingSpinner from '@/components/LoadingSpinner';

/**
 * A page for users to update their password after following a reset link.
 * It handles the session from the URL token and provides a form for the new password.
 */
const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { session, loading: isSessionLoading } = useAuth();
  const { mutate: updatePassword, isPending, error } = useUpdatePassword();

  useEffect(() => {
    // Supabase client handles the #access_token from the URL automatically.
    // If there's no session after loading, the token was invalid or expired.
    if (!isSessionLoading && !session) {
      setMessage('Invalid or expired password reset link. Please try again.');
    }
  }, [session, isSessionLoading]);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!password) {
      setMessage('Password cannot be empty.');
      return;
    }
    updatePassword(
      { password },
      {
        onSuccess: () => {
          setMessage(
            'Your password has been updated successfully. Redirecting to login...'
          );
          setTimeout(() => navigate('/login'), 3000);
        },
      }
    );
  };

  if (isSessionLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex items-center justify-center py-12 container-px">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-heading-2">Update your password</h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Enter a new password for your account.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {session ? (
              <form
                className="space-y-6"
                onSubmit={handlePasswordUpdate}
              >
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {message && (
                  <p
                    className={`text-sm text-center ${
                      error ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {message}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-500 text-center">
                    {error.message}
                  </p>
                )}

                <div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full gap-2"
                  >
                    <Lock className="h-5 w-5" aria-hidden="true" />
                    {isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-red-500 text-center">
                {message || 'You are not authorized to perform this action.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;

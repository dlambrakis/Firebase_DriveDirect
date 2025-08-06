import React, { useState } from 'react';
import { useForgotPassword } from '@directdrive/hooks';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button, Input, Label, Card, CardContent } from '@directdrive/ui';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { mutate: sendResetLink, isPending, error } = useForgotPassword();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    sendResetLink(email, {
      onSuccess: () => {
        setMessage(
          'If an account with that email exists, a password reset link has been sent.'
        );
      },
    });
  };

  return (
    <div className="flex items-center justify-center py-12 container-px">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-heading-2">Forgot your password?</h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Enter your email and we'll send you a link to get back into your
            account.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleResetRequest}>
              <div className="space-y-2">
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {message && (
                <p className="text-sm text-green-600 text-center">{message}</p>
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
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-center">
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

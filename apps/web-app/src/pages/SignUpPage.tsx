import React, { useState } from 'react';
import { useSignUp } from '@directdrive/hooks';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
} from '@directdrive/ui';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate: signUp, isPending, error } = useSignUp();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);
    signUp(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.session) {
            navigate('/dashboard');
          } else {
            // This case occurs if email confirmation is enabled
            setInfoMessage(
              'Sign up successful! Please check your email to confirm your account.'
            );
          }
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center py-12 container-px">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-heading-2">Create your account</h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSignUp}>
              <div className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error.message}
                </p>
              )}
              {infoMessage && (
                <p className="text-sm text-blue-500 text-center">
                  {infoMessage}
                </p>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gap-2"
                >
                  <UserPlus className="h-5 w-5" aria-hidden="true" />
                  {isPending ? 'Creating account...' : 'Sign up'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;

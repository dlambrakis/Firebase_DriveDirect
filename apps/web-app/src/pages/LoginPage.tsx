import React, { useState } from 'react';
import { useSignIn } from '@directdrive/hooks';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@directdrive/ui';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: signIn, isPending, error } = useSignIn();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(
      { email, password },
      {
        onSuccess: () => {
          // Redirect to the dashboard or the intended page after login
          navigate('/dashboard');
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center py-12 container-px">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-heading-2">Sign in to your account</h2>
          <p className="mt-2 text-body-md text-text-secondary">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-primary hover:text-primary/90"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
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

              <div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gap-2"
                >
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                  {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

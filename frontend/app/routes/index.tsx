import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';
import { Label } from '../components/ui/label.js';
import { Button } from '../components/ui/button.js';
import { apiFetch } from '../lib/api.js';
import { meQueryOptions } from '../lib/auth.js';
import type { User } from '../lib/types.js';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context, search }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
      throw redirect({ to: (search as { from?: string })?.from ?? '/dashboard' });
    } catch (err) {
      // ignore; user not logged in
    }
  },
  component: Landing,
});

function Landing() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const mutation = useMutation<User, Error, { email: string; password: string }>(
    async (payload) => {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      return apiFetch<User>(path, { method: 'POST', json: payload });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['me'] });
        await router.invalidate();
        navigate({ to: '/dashboard' });
      },
    },
  );

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">TanStack Start + NestJS</p>
        <h1 className="text-3xl font-semibold">Session-based Auth with RBAC</h1>
        <p className="text-slate-400">No JWTs, no Passport — just HTTP-only cookies.</p>
      </div>

      <div className="flex justify-center gap-2">
        <Button variant={mode === 'login' ? 'default' : 'ghost'} onClick={() => setMode('login')}>
          Login
        </Button>
        <Button variant={mode === 'register' ? 'default' : 'ghost'} onClick={() => setMode('register')}>
          Register
        </Button>
      </div>

      <AuthForm mode={mode} onSubmit={(email, password) => mutation.mutate({ email, password })} loading={mutation.isPending} error={mutation.error?.message} />
    </div>
  );
}

function AuthForm({
  mode,
  onSubmit,
  loading,
  error,
}: {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error?: string;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Welcome back' : 'Create account'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button
          type="button"
          className="w-full"
          disabled={loading}
          onClick={() => onSubmit(email, password)}
        >
          {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </CardContent>
    </Card>
  );
}

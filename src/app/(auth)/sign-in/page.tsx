'use client';

import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Button } from '@/shared/ui/button';
import { useMemo, useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-sm flex-col justify-center px-4">
      <h2 className="mb-2 text-2xl font-semibold">Sign in</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Use your email and password.
      </p>

      {!supabase ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Missing <code>NEXT_PUBLIC_SUPABASE_URL</code> or{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Email</span>
          <input
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Button
          className="w-full"
          disabled={loading || !supabase}
          type="submit"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="text-sm text-muted-foreground">
          No account yet?{' '}
          <a
            className="text-primary underline underline-offset-4"
            href="/sign-up"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

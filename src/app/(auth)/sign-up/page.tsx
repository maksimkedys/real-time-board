'use client';

import { useState, useActionState, useMemo } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { signUpAction } from '@/features/auth/actions/auth.actions';

export default function SignUpPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [state, action, isPending] = useActionState(signUpAction, null);

  async function handleGoogleSignUp() {
    if (!supabase) return;
    setIsGoogleLoading(true);
    setGoogleError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setGoogleError(error.message);
      setIsGoogleLoading(false);
    }
  }

  const isLoading = isPending || isGoogleLoading;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-md flex-col justify-center px-4 py-8">
      <Card className="overflow-hidden border-border bg-card shadow-lg">
        <CardHeader className="space-y-2 pt-8 pb-6 text-center">
          <CardTitle className="text-2xl tracking-wide text-card-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign up below to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="grid gap-6">
            <Button
              type="button"
              disabled={isLoading || !supabase}
              onClick={handleGoogleSignUp}
              className="h-11 w-full border border-transparent bg-white text-slate-900 shadow-sm transition-colors hover:bg-gray-100 hover:text-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
              )}
              <span className="text-[15px] font-medium">
                Sign up with Google
              </span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 tracking-wider text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form action={action} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-card-foreground">
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  className={cn(
                    'h-10 bg-background border-border text-foreground transition-all placeholder:text-muted-foreground/60',
                    state?.fieldErrors?.fullName
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'focus-visible:border-primary focus-visible:ring-primary'
                  )}
                />
                {state?.fieldErrors?.fullName && (
                  <p className="text-xs text-destructive">
                    {state.fieldErrors.fullName[0]}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className={cn(
                    'h-10 bg-background border-border text-foreground transition-all placeholder:text-muted-foreground/60',
                    state?.fieldErrors?.fullName
                      ? 'border-destructive focus-visible:ring-destructive'
                      : 'focus-visible:border-primary focus-visible:ring-primary'
                  )}
                />
                {state?.fieldErrors?.email && (
                  <p className="text-xs text-destructive">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-card-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    className={cn(
                      'h-10 bg-background border-border text-foreground transition-all placeholder:text-muted-foreground/60',
                      state?.fieldErrors?.fullName
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'focus-visible:border-primary focus-visible:ring-primary'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {state?.fieldErrors?.password && (
                  <p className="text-xs text-destructive">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {(state?.error || googleError) && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {state?.error || googleError}
                </div>
              )}

              <Button
                disabled={isLoading}
                type="submit"
                className="mt-2 h-11 w-full bg-primary text-[15px] font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign up
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border bg-background/40 py-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              className="font-medium text-primary transition-colors underline-offset-4 hover:text-primary/80 hover:underline"
              href="/sign-in"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

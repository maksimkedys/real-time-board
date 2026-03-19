'use client';

import { useActionState } from 'react';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

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

import { forgotPasswordAction } from '@/features/auth/actions/auth.actions';

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-md flex-col justify-center px-4 py-8">
      <Card className="overflow-hidden border-border bg-card shadow-lg">
        <CardHeader className="space-y-2 pt-8 pb-6 text-center">
          <CardTitle className="text-2xl tracking-wide text-card-foreground">
            Reset Password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we will send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {state?.success ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-sm font-medium text-foreground">
                {state.success}
              </p>
              <p className="text-xs text-muted-foreground">
                You can safely close this page.
              </p>
            </div>
          ) : (
            <form action={action} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  defaultValue={state?.values?.email}
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

              {state?.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <Button
                disabled={isPending}
                type="submit"
                className="mt-2 h-11 w-full bg-primary text-[15px] font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Send reset link
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border bg-background/40 py-5">
          <Link
            href="/sign-in"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

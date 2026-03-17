'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('An unhandled error occurred:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Something went wrong!
          </h1>
          <p className="max-w-[500px] text-muted-foreground">
            An unexpected error has occurred. We`ve been notified and are
            looking into it.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 max-w-[600px] overflow-auto rounded-md bg-muted p-4 text-left text-xs text-muted-foreground">
            <code>{error.message}</code>
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => reset()}
            className="h-11 px-6 font-medium"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Button asChild className="h-11 px-6 font-medium">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

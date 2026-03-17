import Link from 'next/link';
import { Ghost, Home } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-muted p-4">
          <Ghost className="h-12 w-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Page Not Found
          </h2>
        </div>

        <p className="max-w-[400px] text-muted-foreground">
          Sorry, the page you are looking for doesn`t exist or has been moved.
        </p>

        <div className="pt-4">
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

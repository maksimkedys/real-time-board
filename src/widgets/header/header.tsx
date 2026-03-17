'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Loader2, Menu } from 'lucide-react';

import { ModeToggle } from '@/features/theme-toggle/mode-toggle';
import { Button } from '@/shared/ui/button';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/shared/ui/sheet';
import { SidebarContent } from '@/widgets/sidebar/sidebar-content';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  const handleSignOut = async () => {
    if (!supabase) return;

    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        {!isAuthPage && (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        )}

        <h1 className="font-semibold text-foreground">Realtime Board</h1>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />

        {!isAuthPage && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>Log Out</span>
          </Button>
        )}
      </div>
    </header>
  );
}

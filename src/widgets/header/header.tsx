'use client';

import { ModeToggle } from '@/features/theme-toggle/mode-toggle';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur">
      <h1 className="font-semibold text-foreground">Realtime Board</h1>
      <ModeToggle />
    </header>
  );
}

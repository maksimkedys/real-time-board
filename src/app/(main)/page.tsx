'use client';

import { Plus } from 'lucide-react';
import { useSessionStore } from '@/entities/session/model/session.store';
import { Button } from '@/shared/ui/button';

export default function MainPage() {
  const workspaces = useSessionStore((state) => state.workspaces);

  if (workspaces.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
          <Plus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">No workspaces</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don`t belong to any workspaces yet. Create one in the sidebar to
          get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
          <p className="text-muted-foreground">
            Manage your projects in the current workspace.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Board
        </Button>
      </div>

      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <h3 className="text-xl font-medium">No boards found</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Create your first board to start tracking tasks.
        </p>
        <Button variant="outline">Create New Board</Button>
      </div>
    </div>
  );
}

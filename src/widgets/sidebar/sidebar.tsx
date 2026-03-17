'use client';

import Link from 'next/link';
import { LayoutDashboard, Settings } from 'lucide-react';
import { useSessionStore } from '@/entities/session/model/session.store';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

export function Sidebar() {
  const router = useRouter();
  const { profile, workspaces, activeWorkspaceId, setActiveWorkspace } =
    useSessionStore();

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>
  ) => {
    const newId = e.target.value;
    setActiveWorkspace(newId);
    router.push(`/?workspaceId=${newId}`);
  };

  return (
    <aside className="flex h-[calc(100dvh-56px)] w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-border px-4">
        <select
          value={activeWorkspaceId || ''}
          onChange={handleChange}
          className="w-full truncate bg-transparent font-medium outline-none"
        >
          {workspaces.length > 0 ? (
            workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))
          ) : (
            <option disabled>No workspaces</option>
          )}
        </select>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href="/"
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
        >
          <LayoutDashboard className="mr-3 h-4 w-4" /> Boards
        </Link>
        <Link
          href="/settings"
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
        >
          <Settings className="mr-3 h-4 w-4" /> Settings
        </Link>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium uppercase text-primary">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">
              {profile?.full_name || 'User'}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {profile?.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

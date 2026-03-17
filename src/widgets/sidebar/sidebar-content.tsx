'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LayoutDashboard, Settings } from 'lucide-react';
import { WorkspaceSwitcher } from '@/features/workspaces/ui/workspace-switcher';
import { Profile, Workspace } from '@/shared/types/models.types';
import Image from 'next/image';

interface SidebarContentProps {
  profile: Profile | null;
  workspaces: Workspace[];
  onItemClick?: () => void;
}

export function SidebarContent({
  profile,
  workspaces,
  onItemClick,
}: SidebarContentProps) {
  const searchParams = useSearchParams();
  const urlWorkspaceId = searchParams.get('workspaceId');
  const activeWorkspaceId =
    urlWorkspaceId || (workspaces.length > 0 ? workspaces[0].id : '');

  return (
    <>
      <div className="flex h-14 items-center border-b border-border px-2">
        <WorkspaceSwitcher workspaces={workspaces} onItemClick={onItemClick} />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href={`/?workspaceId=${activeWorkspaceId}`}
          onClick={onItemClick}
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
        >
          <LayoutDashboard className="mr-3 h-4 w-4" /> Boards
        </Link>
        <Link
          href="/settings"
          onClick={onItemClick}
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent"
        >
          <Settings className="mr-3 h-4 w-4" /> Settings
        </Link>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-medium uppercase text-primary">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                fill
                sizes="(max-width: 768px) 80px, 80px"
                className="object-cover"
              />
            ) : (
              profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'
            )}
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
    </>
  );
}

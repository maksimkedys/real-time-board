import { Profile, Workspace } from '@/shared/types/models.types';
import { SidebarContent } from './sidebar-content';

interface SidebarProps {
  profile: Profile | null;
  workspaces: Workspace[];
}

export function Sidebar({ profile, workspaces }: SidebarProps) {
  return (
    <aside className="hidden h-[calc(100dvh-56px)] w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <SidebarContent profile={profile} workspaces={workspaces} />
    </aside>
  );
}

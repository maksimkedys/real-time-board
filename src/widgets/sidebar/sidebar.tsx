import { SidebarContent } from './sidebar-content';

export function Sidebar() {
  return (
    <aside className="hidden h-[calc(100dvh-56px)] w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <SidebarContent />
    </aside>
  );
}

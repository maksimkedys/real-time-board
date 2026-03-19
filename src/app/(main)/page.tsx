import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getUserWorkspaces } from '@/entities/session/api/session.queries';
import { getBoardsByWorkspace } from '@/entities/board/api/board.queries';
import { Boards } from '@/features/boards/ui/boards';

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const workspaces = await getUserWorkspaces(user.id).catch(() => []);

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

  const resolvedParams = await searchParams;
  const activeWorkspaceId = resolvedParams.workspaceId || workspaces[0].id;

  const initialBoards = await getBoardsByWorkspace(activeWorkspaceId);

  return (
    <Boards
      initialBoards={initialBoards}
      workspaceId={activeWorkspaceId}
      key={activeWorkspaceId}
    />
  );
}

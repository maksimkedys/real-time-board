import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Card, Column } from '@/widgets/board/board';
import { Board } from '@/widgets/board/board';

export default function Home() {
  return <HomeInner />;
}

async function HomeInner() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-lg flex-col justify-center px-4">
        <h2 className="mb-2 text-2xl font-semibold">Supabase not configured</h2>
        <p className="text-sm text-muted-foreground">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: ownedWorkspaces, error: ownedError } = await supabase
    .from('workspaces')
    .select('id,name')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true });

  if (ownedError) throw ownedError;

  const { data: memberRows, error: memberError } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id);

  if (memberError) throw memberError;

  const memberWorkspaceIds = Array.from(
    new Set(
      (memberRows ?? []).map((r: { workspace_id: string }) => r.workspace_id)
    )
  );

  const { data: memberWorkspaces, error: memberWorkspacesError } =
    memberWorkspaceIds.length > 0
      ? await supabase
          .from('workspaces')
          .select('id,name')
          .in('id', memberWorkspaceIds)
      : { data: [], error: null };

  if (memberWorkspacesError) throw memberWorkspacesError;

  const workspaces = [...(ownedWorkspaces ?? []), ...(memberWorkspaces ?? [])];

  const workspace = workspaces[0];
  if (!workspace) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-lg flex-col justify-center px-4">
        <h2 className="mb-2 text-2xl font-semibold">No workspaces yet</h2>
        <p className="text-sm text-muted-foreground">
          Create a workspace in Supabase (or I can add UI for it next).
        </p>
      </div>
    );
  }

  const { data: boards, error: boardsError } = await supabase
    .from('boards')
    .select('id,workspace_id,title')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: true });

  if (boardsError) throw boardsError;

  const board = boards?.[0];
  if (!board) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-lg flex-col justify-center px-4">
        <h2 className="mb-2 text-2xl font-semibold">No boards yet</h2>
        <p className="text-sm text-muted-foreground">
          Add a board row in Supabase (or I can add UI for it next).
        </p>
      </div>
    );
  }

  const { data: columns, error: columnsError } = await supabase
    .from('columns')
    .select('id,board_id,title,position')
    .eq('board_id', board.id)
    .order('position', { ascending: true });

  if (columnsError) throw columnsError;

  const columnIds = (columns ?? []).map((c: Column) => c.id);
  const { data: cards, error: cardsError } =
    columnIds.length > 0
      ? await supabase
          .from('cards')
          .select('id,column_id,title,description,position')
          .in('column_id', columnIds)
          .order('position', { ascending: true })
      : { data: [], error: null };

  if (cardsError) throw cardsError;

  const cardsByColumnId: Record<string, Card[]> = {};
  for (const card of (cards ?? []) as Card[]) {
    (cardsByColumnId[card.column_id] ??= []).push(card);
  }

  return (
    <Board
      data={{
        workspace,
        board,
        columns: columns ?? [],
        cardsByColumnId,
      }}
    />
  );
}

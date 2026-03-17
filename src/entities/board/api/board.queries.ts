import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Card, Column } from '@/shared/types/models.types';

export async function getDefaultWorkspaceId(
  userId: string
): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: owned } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', userId)
    .limit(1)
    .single();

  if (owned) return owned.id;

  const { data: member } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  return member?.workspace_id ?? null;
}

export async function getBoardViewData(workspaceId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .single();

  const { data: boards } = await supabase
    .from('boards')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at')
    .limit(1);

  const board = boards?.[0];

  if (!board || !workspace) {
    return { workspace, board: null, columns: [], cardsByColumnId: {} };
  }

  const { data: columns } = await supabase
    .from('columns')
    .select('*')
    .eq('board_id', board.id)
    .order('position');

  const columnIds = (columns ?? []).map((c: Column) => c.id);

  const { data: cards } =
    columnIds.length > 0
      ? await supabase
          .from('cards')
          .select('*')
          .in('column_id', columnIds)
          .order('position')
      : { data: [] };

  const cardsByColumnId: Record<string, Card[]> = {};
  for (const card of (cards ?? []) as Card[]) {
    if (!card.column_id) continue;
    (cardsByColumnId[card.column_id] ??= []).push(card);
  }

  return {
    workspace,
    board,
    columns: columns ?? [],
    cardsByColumnId,
  };
}

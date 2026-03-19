import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import {
  boardIdSchema,
  workspaceIdSchema,
} from '@/shared/schemas/board.schema';

export async function getBoardsByWorkspace(workspaceId: string) {
  const parsed = workspaceIdSchema.safeParse({ workspaceId });
  if (!parsed.success) {
    console.error('Invalid workspaceId:', parsed.error.flatten());
    return [];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('workspace_id', parsed.data.workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load boards on server:', error);
    return [];
  }

  return data || [];
}

export async function getBoardById(boardId: string) {
  const parsed = boardIdSchema.safeParse({ boardId });
  if (!parsed.success) {
    console.error('Invalid boardId:', parsed.error.flatten());
    return null;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', parsed.data.boardId)
    .single();

  if (error) {
    console.error('Failed to load board:', error);
    return null;
  }
  return data;
}

export async function getBoardContent(boardId: string) {
  const parsed = boardIdSchema.safeParse({ boardId });
  if (!parsed.success) {
    console.error('Invalid boardId:', parsed.error.flatten());
    return { columns: [], cards: [] };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { columns: [], cards: [] };

  const { data: columns, error: colError } = await supabase
    .from('columns')
    .select('*')
    .eq('board_id', parsed.data.boardId)
    .order('position', { ascending: true });

  if (colError || !columns || columns.length === 0) {
    return { columns: [], cards: [] };
  }

  const columnIds = columns.map((col) => col.id);
  const { data: cards, error: cardError } = await supabase
    .from('cards')
    .select('*')
    .in('column_id', columnIds)
    .order('position', { ascending: true });

  if (cardError) {
    console.error('Failed to load cards:', cardError);
  }

  return {
    columns,
    cards: cards || [],
  };
}

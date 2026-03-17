import { createSupabaseServerClient } from '@/shared/api/supabase/server';

export async function getBoardsByWorkspace(workspaceId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load boards on server:', error);
    return [];
  }

  return data || [];
}

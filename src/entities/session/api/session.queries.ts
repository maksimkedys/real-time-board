import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Profile, Workspace } from '@/shared/types/models.types';
import { cache } from 'react';

export const getUserProfile = cache(async (userId: string, email?: string) => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return (
    profileData || {
      id: userId,
      email: email ?? null,
      full_name: null,
      avatar_url: null,
      created_at: null,
    }
  );
});

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: ownedWorkspaces } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: true });

  const { data: memberRows } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId);

  const memberWorkspaceIds = Array.from(
    new Set(
      (memberRows ?? [])
        .map((r) => r.workspace_id)
        .filter((id): id is string => id !== null)
    )
  );

  const { data: memberWorkspaces } =
    memberWorkspaceIds.length > 0
      ? await supabase
          .from('workspaces')
          .select('*')
          .in('id', memberWorkspaceIds)
      : { data: [] };

  return [...(ownedWorkspaces ?? []), ...(memberWorkspaces ?? [])];
}

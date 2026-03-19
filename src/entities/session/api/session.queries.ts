import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import type { Workspace } from '@/shared/types/models.types';
import { userIdSchema } from '@/shared/schemas/workspace.schema';
import { cache } from 'react';

export const getUserProfile = cache(async (userId: string, email?: string) => {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) throw new Error('Invalid userId');

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', parsed.data.userId)
    .single();

  return (
    profileData || {
      id: parsed.data.userId,
      email: email ?? null,
      full_name: null,
      avatar_url: null,
      created_at: null,
    }
  );
});

export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const parsed = userIdSchema.safeParse({ userId });
  if (!parsed.success) {
    console.error('Invalid userId:', parsed.error.flatten());
    return [];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: ownedWorkspaces } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', parsed.data.userId)
    .order('created_at', { ascending: true });

  const { data: memberRows } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', parsed.data.userId);

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

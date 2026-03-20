import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { WorkspaceMemberWithProfile } from '@/shared/types/models.types';
import { sendWorkspaceInvite } from '../actions/workspace-invite.actions';

export const useWorkspaceMembers = (workspaceId: string | null) => {
  const supabase = createSupabaseBrowserClient();
  const [members, setMembers] = useState<WorkspaceMemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !supabase) return;

    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('workspace_members')
          .select(
            `
            id,
            role,
            user_id,
            profiles (*)
          `
          )
          .eq('workspace_id', workspaceId);

        if (fetchError) throw fetchError;

        const members: WorkspaceMemberWithProfile[] = (data ?? []).map(
          (row) => ({
            id: row.id,
            role: row.role,
            user_id: row.user_id,
            profiles: row.profiles,
          })
        );
        setMembers(members);
      } catch (err: unknown) {
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceId, supabase]);

  const inviteMemberByEmail = async (email: string) => {
    setError(null);
    if (!workspaceId) return false;

    try {
      const result = await sendWorkspaceInvite(email, workspaceId);

      if (result.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err: unknown) {
      console.error('Error inviting member:', err);
      setError('Error sending invitation.');
      return false;
    }
  };

  const removeMember = async (memberId: string) => {
    if (!supabase) return;

    try {
      const { error: deleteError } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err: unknown) {
      console.error('Error removing member:', err);
    }
  };

  return {
    members,
    isLoading,
    error,
    inviteMemberByEmail,
    removeMember,
    setError,
  };
};

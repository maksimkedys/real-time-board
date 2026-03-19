import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';

export interface WorkspaceMemberWithProfile {
  id: string;
  role: string | null;
  user_id: string | null;
  profiles: Profile | null;
}

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
        setMembers((data as unknown as WorkspaceMemberWithProfile[]) || []);
      } catch (err: unknown) {
        console.error('Error fetching members:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceId, supabase]);

  const addMemberByEmail = async (email: string) => {
    setError(null);
    if (!workspaceId || !supabase) return false;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (profileError || !profile) {
        setError('User with this email was not found.');
        return false;
      }

      const isAlreadyMember = members.some((m) => m.user_id === profile.id);
      if (isAlreadyMember) {
        setError('This user is already in workspace');
        return false;
      }

      const { data: newMember, error: insertError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: profile.id,
          role: 'member',
        })
        .select(
          `
          id,
          role,
          user_id,
          profiles (*)
        `
        )
        .single();

      if (insertError) throw insertError;

      if (newMember) {
        setMembers((prev) => [
          ...prev,
          newMember as unknown as WorkspaceMemberWithProfile,
        ]);
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error('Error adding member:', err);
      setError('Error adding member.');
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
    addMemberByEmail,
    removeMember,
    setError,
  };
};

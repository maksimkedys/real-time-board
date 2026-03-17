import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSessionStore } from '@/entities/session/model/session.store';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';

export const useWorkspaceSwitcher = (onItemClick?: () => void) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const { profile, workspaces, activeWorkspaceId, setActiveWorkspace } =
    useSessionStore();

  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspace(id);
    router.push(`/?workspaceId=${id}`);
    if (onItemClick) onItemClick();
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !profile?.id) return;

    if (!supabase) return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('workspaces')
        .insert({ name: newWorkspaceName.trim(), owner_id: profile.id })
        .select()
        .single();

      if (error) throw error;

      useSessionStore.setState((state) => ({
        workspaces: [...state.workspaces, data],
        activeWorkspaceId: data.id,
      }));

      setIsOpen(false);
      setNewWorkspaceName('');
      handleSelectWorkspace(data.id);
      router.refresh();
    } catch (error) {
      console.error('Error of creating workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workspaces,
    activeWorkspaceId,
    isOpen,
    setIsOpen,
    newWorkspaceName,
    setNewWorkspaceName,
    isLoading,
    handleSelectWorkspace,
    handleCreateWorkspace,
  };
};

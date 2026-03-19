import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Workspace } from '@/shared/types/models.types';
import { workspaceNameSchema } from '@/shared/schemas/workspace.schema';

export const useWorkspaceSwitcher = (
  workspaces: Workspace[],
  onItemClick?: () => void
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const urlWorkspaceId = searchParams.get('workspaceId');
  const activeWorkspaceId =
    urlWorkspaceId || (workspaces.length > 0 ? workspaces[0].id : '');

  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectWorkspace = (id: string) => {
    router.push(`/?workspaceId=${id}`);
    if (onItemClick) onItemClick();
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = workspaceNameSchema.safeParse({ name: newWorkspaceName });
    if (!parsed.success || !supabase) return;

    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('workspaces')
        .insert({ name: parsed.data.name, owner_id: user?.id })
        .select()
        .single();

      if (error) throw error;

      setIsOpen(false);
      setNewWorkspaceName('');

      router.push(`/?workspaceId=${data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Помилка створення воркспейсу:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Board } from '@/shared/types/models.types';

export const useBoards = (initialBoards: Board[], workspaceId: string) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [boards, setBoards] = useState<Board[]>(initialBoards);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim() || !workspaceId || !supabase) return;

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('boards')
        .insert({ title: newBoardTitle.trim(), workspace_id: workspaceId })
        .select()
        .single();

      if (error) throw error;

      setBoards([data, ...boards]);
      setIsDialogOpen(false);
      setNewBoardTitle('');

      router.refresh();
    } catch (error) {
      console.error('Помилка створення дошки:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    boards,
    isDialogOpen,
    setIsDialogOpen,
    newBoardTitle,
    setNewBoardTitle,
    isCreating,
    handleCreateBoard,
  };
};

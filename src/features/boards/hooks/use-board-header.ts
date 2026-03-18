import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';

export const useBoardHeader = (boardId: string, initialTitle: string) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [boardTitle, setBoardTitle] = useState(initialTitle);
  const [newTitle, setNewTitle] = useState(initialTitle);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleRenameBoard = async () => {
    if (!newTitle.trim() || newTitle === boardTitle) {
      setIsRenameModalOpen(false);
      return;
    }

    const previousTitle = boardTitle;
    try {
      setBoardTitle(newTitle.trim());
      setIsRenameModalOpen(false);

      if (!supabase) throw new Error('Supabase init error');
      const { error } = await supabase
        .from('boards')
        .update({ title: newTitle.trim() })
        .eq('id', boardId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error renaming board:', error);
      setBoardTitle(previousTitle);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      if (!supabase) throw new Error('Supabase init error');
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return {
    boardTitle,
    newTitle,
    setNewTitle,
    isRenameModalOpen,
    setIsRenameModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isCopied,
    handleShare,
    handleRenameBoard,
    handleDeleteBoard,
  };
};

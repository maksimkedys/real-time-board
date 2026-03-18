import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Card, Column } from '@/shared/types/models.types';

export const useBoard = (
  boardId: string,
  initialColumns: Column[],
  initialCards: Card[]
) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [cards, setCards] = useState<Card[]>(initialCards);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const handleAddColumn = async (title: string) => {
    const position = columns.length;
    const tempId = crypto.randomUUID();

    try {
      const newCol = {
        id: tempId,
        title,
        board_id: boardId,
        position,
        created_at: new Date().toISOString(),
      } as Column;

      setColumns((prev) => [...prev, newCol]);

      if (!supabase) throw new Error('Supabase init error');

      const { data, error } = await supabase
        .from('columns')
        .insert({ title, board_id: boardId, position })
        .select()
        .single();

      if (error) throw error;

      setColumns((prev) => prev.map((c) => (c.id === tempId ? data : c)));
      router.refresh();
    } catch (error) {
      console.error('Error adding column:', error);
      setColumns(columns);
    }
  };

  const handleUpdateColumn = async (columnId: string, title: string) => {
    const previousColumns = [...columns];

    try {
      setColumns((prev) =>
        prev.map((c) => (c.id === columnId ? { ...c, title } : c))
      );

      if (!supabase) throw new Error('Supabase init error');

      const { error } = await supabase
        .from('columns')
        .update({ title })
        .eq('id', columnId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error updating column:', error);
      setColumns(previousColumns);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    const previousColumns = [...columns];

    try {
      setColumns((prev) => prev.filter((c) => c.id !== columnId));

      if (!supabase) throw new Error('Supabase init error');

      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error deleting column:', error);
      setColumns(previousColumns);
    }
  };

  const handleAddCard = async (
    columnId: string,
    title: string,
    description: string | null = null
  ) => {
    const columnCards = cards.filter((c) => c.column_id === columnId);
    const position = columnCards.length;
    const tempId = crypto.randomUUID();

    try {
      const newCard = {
        id: tempId,
        title,
        column_id: columnId,
        position,
        description,
        due_date: null,
        created_at: new Date().toISOString(),
      } as Card;

      setCards((prev) => [...prev, newCard]);

      if (!supabase) throw new Error('Supabase init error');

      const { data, error } = await supabase
        .from('cards')
        .insert({ title, column_id: columnId, position, description })
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => prev.map((c) => (c.id === tempId ? data : c)));
      router.refresh();
    } catch (error) {
      console.error('Error adding card:', error);
      setCards(cards);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const previousCards = [...cards];

    try {
      setCards((prev) => prev.filter((c) => c.id !== cardId));

      if (!supabase) throw new Error('Supabase init error');

      const { error } = await supabase.from('cards').delete().eq('id', cardId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error deleting card:', error);
      setCards(previousCards);
    }
  };

  const handleUpdateCard = async (cardId: string, updates: Partial<Card>) => {
    const previousCards = [...cards];

    try {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
      );

      if (!supabase) throw new Error('Supabase init error');

      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Error updating card:', error);
      setCards(previousCards);
    }
  };

  return {
    columns,
    cards,
    handleAddColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleAddCard,
    handleDeleteCard,
    handleUpdateCard,
  };
};

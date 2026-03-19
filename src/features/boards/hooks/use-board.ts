import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Card, Column } from '@/shared/types/models.types';
import { DropResult } from '@hello-pangea/dnd';
import { useBoardSync } from './use-board-sync';

export const useBoard = (
  boardId: string,
  initialColumns: Column[],
  initialCards: Card[]
) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [cards, setCards] = useState<Card[]>(initialCards);

  useBoardSync(boardId, columns, setColumns, setCards);

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
    description: string | null = null,
    dueDate: string | null = null
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
        due_date: dueDate,
        created_at: new Date().toISOString(),
      } as Card;

      setCards((prev) => [...prev, newCard]);

      if (!supabase) throw new Error('Supabase init error');

      const { data, error } = await supabase
        .from('cards')
        .insert({
          title,
          column_id: columnId,
          position,
          description,
          due_date: dueDate,
        })
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

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumns = Array.from(columns).sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );
      const [movedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, movedColumn);

      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        position: index,
      }));
      setColumns(updatedColumns);

      try {
        if (!supabase) throw new Error('Supabase init error');

        await Promise.all(
          updatedColumns.map((col) =>
            supabase
              .from('columns')
              .update({ position: col.position })
              .eq('id', col.id)
          )
        );
      } catch (error) {
        console.error('Error updating column positions:', error);
        setColumns(columns);
      }
      return;
    }

    if (type === 'card') {
      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;

      const sourceCards = cards
        .filter((c) => c.column_id === sourceColId)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      const destCards =
        sourceColId === destColId
          ? sourceCards
          : cards
              .filter((c) => c.column_id === destColId)
              .sort((a, b) => (a.position || 0) - (b.position || 0));

      if (sourceColId === destColId) {
        const [movedCard] = sourceCards.splice(source.index, 1);
        sourceCards.splice(destination.index, 0, movedCard);

        const updatedCards = sourceCards.map((c, idx) => ({
          ...c,
          position: idx,
        }));

        setCards((prev) =>
          prev.map((c) =>
            c.column_id === sourceColId
              ? updatedCards.find((uc) => uc.id === c.id) || c
              : c
          )
        );

        try {
          await Promise.all(
            updatedCards.map((card) =>
              supabase!
                .from('cards')
                .update({ position: card.position })
                .eq('id', card.id)
            )
          );
        } catch (error) {
          console.error(error);
          setCards(cards);
        }
      } else {
        const movedCard = {
          ...sourceCards.splice(source.index, 1)[0],
          column_id: destColId,
        };
        destCards.splice(destination.index, 0, movedCard);

        const updatedSource = sourceCards.map((c, idx) => ({
          ...c,
          position: idx,
        }));
        const updatedDest = destCards.map((c, idx) => ({
          ...c,
          position: idx,
        }));

        setCards((prev) =>
          prev.map((c) => {
            if (c.id === movedCard.id)
              return { ...movedCard, position: destination.index };
            if (c.column_id === sourceColId)
              return updatedSource.find((uc) => uc.id === c.id) || c;
            if (c.column_id === destColId)
              return updatedDest.find((uc) => uc.id === c.id) || c;
            return c;
          })
        );

        try {
          await Promise.all([
            supabase!
              .from('cards')
              .update({ column_id: destColId, position: destination.index })
              .eq('id', movedCard.id),
            ...updatedSource.map((card) =>
              supabase!
                .from('cards')
                .update({ position: card.position })
                .eq('id', card.id)
            ),
            ...updatedDest.map((card) =>
              supabase!
                .from('cards')
                .update({ position: card.position })
                .eq('id', card.id)
            ),
          ]);
        } catch (error) {
          console.error(error);
          setCards(cards);
        }
      }
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
    handleDragEnd,
  };
};

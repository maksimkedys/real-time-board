import { useEffect, useRef, RefObject } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Card, Column } from '@/shared/types/models.types';

export const useBoardSync = (
  boardId: string,
  columns: Column[],
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  pendingColumnIds: RefObject<Set<string>>,
  pendingCardIds: RefObject<Set<string>>
) => {
  const supabase = createSupabaseBrowserClient();

  const columnsRef = useRef(columns);

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  useEffect(() => {
    if (!boardId || !supabase) return;

    const channel = supabase
      .channel(`board_sync:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setColumns((prev) => {
              if (prev.find((c) => c.id === payload.new.id)) return prev;
              const pending = pendingColumnIds.current;
              const tempEntry = prev.find(
                (c) =>
                  pending.has(c.id) &&
                  c.board_id === payload.new.board_id &&
                  c.position === payload.new.position
              );
              if (tempEntry) {
                pending.delete(tempEntry.id);
                return prev.map((c) =>
                  c.id === tempEntry.id ? (payload.new as Column) : c
                );
              }
              return [...prev, payload.new as Column];
            });
          } else if (payload.eventType === 'UPDATE') {
            setColumns((prev) =>
              prev.map((c) =>
                c.id === payload.new.id ? (payload.new as Column) : c
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setColumns((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards' },
        (payload) => {
          const currentCols = columnsRef.current;

          if (payload.eventType === 'INSERT') {
            const isOurBoard = currentCols.some(
              (col) => col.id === payload.new.column_id
            );
            if (!isOurBoard) return;

            setCards((prev) => {
              if (prev.find((c) => c.id === payload.new.id)) return prev;
              const pending = pendingCardIds.current;
              const tempEntry = prev.find(
                (c) =>
                  pending.has(c.id) &&
                  c.column_id === payload.new.column_id &&
                  c.position === payload.new.position
              );
              if (tempEntry) {
                pending.delete(tempEntry.id);
                return prev.map((c) =>
                  c.id === tempEntry.id ? (payload.new as Card) : c
                );
              }
              return [...prev, payload.new as Card];
            });
          } else if (payload.eventType === 'UPDATE') {
            const isOurBoard = currentCols.some(
              (col) => col.id === payload.new.column_id
            );

            setCards((prev) => {
              const exists = prev.find((c) => c.id === payload.new.id);
              if (isOurBoard && !exists) {
                return [...prev, payload.new as Card];
              }
              return prev.map((c) =>
                c.id === payload.new.id ? { ...c, ...(payload.new as Card) } : c
              );
            });
          } else if (payload.eventType === 'DELETE') {
            setCards((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, supabase, setColumns, setCards]);
};

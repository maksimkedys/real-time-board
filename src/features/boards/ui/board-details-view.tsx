'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useBoard } from '../hooks/use-board';
import { BoardColumn } from './board-column';
import { BoardAddList } from './board-add-list';
import { Board, Card, Column } from '@/shared/types/models.types';

interface BoardDetailsViewProps {
  board: Board;
  initialColumns: Column[];
  initialCards: Card[];
}

export function BoardDetailsView({
  board,
  initialColumns,
  initialCards,
}: BoardDetailsViewProps) {
  const {
    columns,
    cards,
    handleAddColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleAddCard,
    handleDeleteCard,
    handleUpdateCard,
  } = useBoard(board.id, initialColumns, initialCards);
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{board.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Board ID: {board.id.split('-')[0]}...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            Share
          </Button>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/10 p-6">
        <div className="flex h-full items-start gap-6 pb-4">
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              cards={cards.filter((c) => c.column_id === col.id)}
              onAddCard={handleAddCard}
              onDeleteColumn={handleDeleteColumn}
              onUpdateColumn={handleUpdateColumn}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
            />
          ))}

          <BoardAddList onAddList={handleAddColumn} />
        </div>
      </div>
    </div>
  );
}

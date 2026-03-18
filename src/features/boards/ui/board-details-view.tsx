'use client';

import { useBoard } from '../hooks/use-board';
import { BoardColumn } from './board-column';
import { BoardAddList } from './board-add-list';
import { Board, Card, Column } from '@/shared/types/models.types';
import { BoardHeader } from './board-header';

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
      <BoardHeader board={board} />

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

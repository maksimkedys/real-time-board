'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { useBoard } from '../hooks/use-board';
import { BoardColumn } from './board-column/board-column';
import { BoardAddList } from './board-add-list';
import { BoardHeader } from './board-header';
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
    handleDragEnd,
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/10 p-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex h-full items-start pb-4">
                {columns.map((col, index) => (
                  <BoardColumn
                    key={col.id}
                    column={col}
                    index={index}
                    workspaceId={board.workspace_id || ''}
                    cards={cards
                      .filter((c) => c.column_id === col.id)
                      .sort((a, b) => (a.position || 0) - (b.position || 0))}
                    onAddCard={handleAddCard}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateColumn={handleUpdateColumn}
                    onDeleteCard={handleDeleteCard}
                    onUpdateCard={handleUpdateCard}
                  />
                ))}
                {provided.placeholder}
                <BoardAddList onAddList={handleAddColumn} />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

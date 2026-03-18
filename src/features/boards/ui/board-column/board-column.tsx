'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

import { Card, Column } from '@/shared/types/models.types';
import { CardModal } from '../card-modal';
import { BoardCard } from '../board-card/board-card';
import { BoardColumnHeader } from './board-column-header';

interface BoardColumnProps {
  column: Column;
  cards: Card[];
  index: number;
  onAddCard: (
    colId: string,
    title: string,
    desc: string | null,
    due: string | null
  ) => Promise<void>;
  onDeleteColumn: (id: string) => void;
  onUpdateColumn: (id: string, title: string) => void;
  onDeleteCard: (id: string) => void;
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
}

export function BoardColumn({
  column,
  cards,
  index,
  onAddCard,
  onDeleteColumn,
  onUpdateColumn,
  onDeleteCard,
  onUpdateCard,
}: BoardColumnProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(column.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleTitleUpdate = () => {
    setIsEditingTitle(false);
    if (editTitleValue.trim() && editTitleValue !== column.title) {
      onUpdateColumn(column.id, editTitleValue);
    } else {
      setEditTitleValue(column.title);
    }
  };

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-3 shadow-sm border border-border/40"
          >
            <BoardColumnHeader
              title={column.title}
              cardsCount={cards.length}
              isEditingTitle={isEditingTitle}
              editTitleValue={editTitleValue}
              setIsEditingTitle={setIsEditingTitle}
              setEditTitleValue={setEditTitleValue}
              handleTitleUpdate={handleTitleUpdate}
              onDeleteClick={() => setIsDeleteDialogOpen(true)}
              dragHandleProps={provided.dragHandleProps}
            />

            <Droppable droppableId={column.id} type="card">
              {(providedDroppable) => (
                <div
                  {...providedDroppable.droppableProps}
                  ref={providedDroppable.innerRef}
                  className="flex flex-col gap-2 overflow-y-auto mb-2 min-h-[10px]"
                >
                  {cards.map((card, cardIndex) => (
                    <BoardCard
                      key={card.id}
                      card={card}
                      index={cardIndex}
                      columnTitle={column.title}
                      onDelete={onDeleteCard}
                      onUpdate={onUpdateCard}
                    />
                  ))}
                  {providedDroppable.placeholder}
                </div>
              )}
            </Droppable>

            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-1 w-full justify-start bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground border border-transparent hover:border-border/50 cursor-pointer transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a card
            </Button>
          </div>
        )}
      </Draggable>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this list?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the list <code>{column.title}</code>{' '}
              and all <b>{cards.length}</b> cards inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteColumn(column.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(title, description, dueDate) =>
          onAddCard(column.id, title, description, dueDate)
        }
        modalTitle="Create New Card"
        submitButtonText="Create Card"
      />
    </>
  );
}

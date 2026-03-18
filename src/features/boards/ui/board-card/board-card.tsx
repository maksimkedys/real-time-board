'use client';

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

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

import { Card } from '@/shared/types/models.types';
import { CardDetailModal } from '../card-detail/card-detail-modal';
import { useCardAssignees } from '../../hooks/use-card-assignees';
import { BoardCardContent } from './board-card-content';

interface BoardCardProps {
  card: Card;
  columnTitle: string;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Card>) => void;
}

export function BoardCard({
  card,
  columnTitle,
  index,
  onDelete,
  onUpdate,
}: BoardCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { assignees, availableUsers, toggleAssignee, isLoadingAssignees } =
    useCardAssignees(card.id);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setIsEditDialogOpen(true)}
            className={`group relative cursor-pointer rounded-xl border p-4 shadow-sm flex flex-col gap-3 min-h-[140px] w-full transition-colors ${
              snapshot.isDragging
                ? 'bg-background border-primary shadow-lg scale-105 z-50 ring-2 ring-primary/20'
                : 'bg-card border-border/50 hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <BoardCardContent
              card={card}
              assignees={assignees}
              onEditClick={() => setIsEditDialogOpen(true)}
              onDeleteClick={(e?: Event) => {
                e?.preventDefault();
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        )}
      </Draggable>

      <CardDetailModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        card={card}
        columnTitle={columnTitle}
        onUpdate={onUpdate}
        onDelete={onDelete}
        assignees={assignees}
        availableUsers={availableUsers}
        toggleAssignee={toggleAssignee}
        isLoadingAssignees={isLoadingAssignees}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              card <b>{card.title}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(card.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Card
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

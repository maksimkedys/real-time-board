'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Trash2, Pencil } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
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
import { BoardCard } from './board-card';
import { Card, Column } from '@/shared/types/models.types';
import { CardModal } from './card-modal';

interface BoardColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: (
    columnId: string,
    title: string,
    description: string | null
  ) => Promise<void>;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
}

export function BoardColumn({
  column,
  cards,
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
      <div className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-3 shadow-sm border border-border/40">
        <div className="mb-3 flex items-center justify-between px-1 gap-2">
          {isEditingTitle ? (
            <Input
              autoFocus
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
              className="h-7 text-sm font-semibold px-2"
            />
          ) : (
            <h3
              className="font-semibold text-sm text-foreground cursor-pointer flex-1 truncate"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
              <span className="text-muted-foreground font-normal ml-1">
                {cards.length}
              </span>
            </h3>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 cursor-pointer hover:bg-muted/80"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" /> Rename List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto mb-2">
          {/* ТУТ МАЄ БУТИ ТІЛЬКИ ОДИН РЕНДЕР КАРТОК */}
          {cards.map((card) => (
            <BoardCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-1 w-full justify-start bg-secondary/50 hover:bg-secondary text-secondary-foreground/70 hover:text-secondary-foreground border border-transparent hover:border-border/50 cursor-pointer transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add a card
        </Button>
      </div>

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
        onSave={(title, description) =>
          onAddCard(column.id, title, description)
        }
        modalTitle="Create New Card"
        submitButtonText="Create Card"
      />
    </>
  );
}

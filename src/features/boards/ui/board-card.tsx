'use client';

import { useState } from 'react';
import { MoreHorizontal, AlignLeft, Trash2, Pencil } from 'lucide-react';

import { Button } from '@/shared/ui/button';
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

import { Card } from '@/shared/types/models.types';
import { CardModal } from './card-modal';

interface BoardCardProps {
  card: Card;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Card>) => void;
}

export function BoardCard({ card, onDelete, onUpdate }: BoardCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <div
        className="group relative cursor-pointer rounded-xl border border-border/50 bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md hover:ring-1 hover:ring-primary/30 transition-all flex flex-col gap-3 min-h-[140px] w-full"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-card-foreground leading-snug flex-1">
            {card.title}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                onClick={(e) => e.stopPropagation()} // Блокуємо відкриття модалки картки
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40"
              onClick={(e) => e.stopPropagation()} // Блокуємо відкриття модалки картки при кліку на меню
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setIsEditDialogOpen(true)} // ПРОСТО ВІДКРИВАЄМО (Radix сам закриє меню)
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault(); // Запобігаємо миттєвому закриттю меню, щоб показати Alert
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {card.description && (
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {card.description}
            </p>
          </div>
        )}

        {card.description && (
          <div className="flex items-center text-muted-foreground mt-auto">
            <AlignLeft className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Модалка редагування */}
      <CardModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        initialData={{ title: card.title, description: card.description }}
        onSave={(title, description) =>
          onUpdate(card.id, { title, description })
        }
        modalTitle="Edit Card Details"
        submitButtonText="Save Changes"
      />

      {/* Модалка видалення */}
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

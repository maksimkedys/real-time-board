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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

import { Card } from '@/shared/types/models.types';
import { CardDetailModal } from './card-detail/card-detail-modal';
import { useCardAssignees } from '../hooks/use-card-assignees';

interface BoardCardProps {
  card: Card;
  columnTitle: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Card>) => void;
}

export function BoardCard({
  card,
  columnTitle,
  onDelete,
  onUpdate,
}: BoardCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { assignees, availableUsers, toggleAssignee, isLoadingAssignees } =
    useCardAssignees(card.id);
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
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
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

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center text-muted-foreground">
            {card.description && <AlignLeft className="h-4 w-4" />}
          </div>

          {assignees.length > 0 && (
            <div className="flex -space-x-2">
              {assignees.map((user) => (
                <Avatar
                  key={user.id}
                  className="w-6 h-6 ring-2 ring-card"
                  title={user.full_name || 'User'}
                >
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-[10px] uppercase bg-primary/10 text-primary">
                    {user.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
      </div>

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

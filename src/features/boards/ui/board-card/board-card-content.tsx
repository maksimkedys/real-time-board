'use client';

import { MoreHorizontal, AlignLeft, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Card, Profile } from '@/shared/types/models.types';

interface BoardCardContentProps {
  card: Card;
  assignees: Profile[];
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function BoardCardContent({
  card,
  assignees,
  onEditClick,
  onDeleteClick,
}: BoardCardContentProps) {
  return (
    <>
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
            <DropdownMenuItem className="cursor-pointer" onSelect={onEditClick}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onSelect={onDeleteClick}
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
    </>
  );
}

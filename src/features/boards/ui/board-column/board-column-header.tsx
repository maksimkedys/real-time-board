'use client';

import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface BoardColumnHeaderProps {
  title: string;
  cardsCount: number;
  isEditingTitle: boolean;
  editTitleValue: string;
  setIsEditingTitle: (val: boolean) => void;
  setEditTitleValue: (val: string) => void;
  handleTitleUpdate: () => void;
  onDeleteClick: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

export function BoardColumnHeader({
  title,
  cardsCount,
  isEditingTitle,
  editTitleValue,
  setIsEditingTitle,
  setEditTitleValue,
  handleTitleUpdate,
  onDeleteClick,
  dragHandleProps,
}: BoardColumnHeaderProps) {
  return (
    <div
      {...dragHandleProps}
      className="mb-3 flex items-center justify-between px-1 gap-2 cursor-grab active:cursor-grabbing"
    >
      {isEditingTitle ? (
        <Input
          autoFocus
          value={editTitleValue}
          onChange={(e) => setEditTitleValue(e.target.value)}
          onBlur={handleTitleUpdate}
          onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
          maxLength={100}
          className="h-7 text-sm font-semibold px-2"
        />
      ) : (
        <h3
          className="font-semibold text-sm text-foreground cursor-pointer flex-1 truncate"
          onClick={() => setIsEditingTitle(true)}
        >
          {title}{' '}
          <span className="text-muted-foreground font-normal ml-1">
            {cardsCount}
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
              onDeleteClick();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

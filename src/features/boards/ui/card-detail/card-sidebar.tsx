'use client';

import { Clock, Loader2, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Profile } from '@/shared/types/models.types';

interface CardSidebarProps {
  assignees: Profile[];
  availableUsers: Profile[];
  isLoadingAssignees: boolean;
  toggleAssignee: (user: Profile) => void;
  dueDate: string | null;
  onSetDueDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export function CardSidebar({
  assignees,
  availableUsers,
  isLoadingAssignees,
  toggleAssignee,
  dueDate,
  onSetDueDate,
  onDelete,
}: CardSidebarProps) {
  return (
    <div className="w-48 bg-muted/10 border-l border-border p-4 flex flex-col gap-6">
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Assignees
        </h4>
        <div className="flex flex-wrap gap-2">
          {isLoadingAssignees ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            assignees.map((user) => (
              <Avatar
                key={user.id}
                className="w-8 h-8 ring-2 ring-background cursor-pointer hover:opacity-80 transition-opacity"
                title={user.full_name || 'User'}
              >
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-xs uppercase bg-primary/10 text-primary">
                  {user.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            ))
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full border-dashed cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableUsers.map((user) => (
                <DropdownMenuCheckboxItem
                  key={user.id}
                  checked={assignees.some((a) => a.id === user.id)}
                  onCheckedChange={() => toggleAssignee(user)}
                  className="cursor-pointer"
                >
                  {user.full_name || user.email}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Actions
        </h4>
        <div className="relative mt-2">
          <Clock className="w-4 h-4 absolute left-3 top-2 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            className="pl-9 h-8 text-sm cursor-pointer"
            value={dueDate ? dueDate.split('T')[0] : ''}
            onChange={onSetDueDate}
          />
        </div>
        <Button
          variant="destructive"
          className="w-full justify-start cursor-pointer text-sm h-8 mt-4 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Card
        </Button>
      </div>
    </div>
  );
}

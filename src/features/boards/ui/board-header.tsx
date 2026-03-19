'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Share2,
  Check,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
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

import { Board } from '@/shared/types/models.types';
import { useBoardHeader } from '../hooks/use-board-header';
import { WorkspaceMembersModal } from '@/features/workspaces/ui/workspace-members-modal';
import { useBoardPresence } from '../hooks/use-board-presence';

interface BoardHeaderProps {
  board: Board;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const {
    boardTitle,
    newTitle,
    setNewTitle,
    isRenameModalOpen,
    setIsRenameModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isCopied,
    handleShare,
    handleRenameBoard,
    handleDeleteBoard,
  } = useBoardHeader(board.id, board.title);

  const { activeUsers } = useBoardPresence(board.id);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{boardTitle}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Board ID: {board.id.split('-')[0]}...
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-border pr-4">
            <div className="flex text-xs text-muted-foreground items-center gap-1.5 mr-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {activeUsers.length} online
            </div>

            <div className="flex -space-x-2">
              {activeUsers.map((user) => (
                <Avatar
                  key={user.id}
                  className="w-8 h-8 ring-2 ring-background transition-transform hover:-translate-y-1 hover:z-10 cursor-pointer"
                  title={`${user.full_name || user.email} is viewing`}
                >
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs uppercase bg-primary/10 text-primary font-medium">
                    {user.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2"
              onClick={() => setIsMembersModalOpen(true)}
            >
              <Users className="h-4 w-4" />
              <span>Members</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2 w-[88px]"
              onClick={handleShare}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsRenameModalOpen(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Rename Board
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Board Title
            </label>
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameBoard()}
              maxLength={100}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameBoard} disabled={!newTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this board?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the board
              <b> {boardTitle} </b> and all its columns and cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBoard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Board
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <WorkspaceMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        workspaceId={board.workspace_id}
      />
    </>
  );
}

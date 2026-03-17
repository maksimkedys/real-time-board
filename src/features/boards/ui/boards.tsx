'use client';

import Link from 'next/link';
import { Plus, LayoutTemplate, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useBoards } from '../hooks/use-boards';
import { Board } from '@/shared/types/models.types';

interface BoardsProps {
  initialBoards: Board[];
  workspaceId: string;
}

export function Boards({ initialBoards, workspaceId }: BoardsProps) {
  const {
    boards,
    isDialogOpen,
    setIsDialogOpen,
    newBoardTitle,
    setNewBoardTitle,
    isCreating,
    handleCreateBoard,
  } = useBoards(initialBoards, workspaceId);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
          <p className="text-muted-foreground">
            Manage your projects in the current workspace.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <LayoutTemplate className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium">No boards found</h3>
          <p className="text-muted-foreground mt-1 mb-6 max-w-sm">
            Create your first board to start tracking tasks and collaborating
            with your team.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Create New Board
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group flex h-32 flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                {board.title}
              </h3>
              <p
                className="text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {board.created_at &&
                  new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(board.created_at))}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateBoard}>
            <DialogHeader>
              <DialogTitle>Create Board</DialogTitle>
              <DialogDescription>
                Give your new board a title. You can change this later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Board Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Q3 Roadmap"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !newBoardTitle.trim()}
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

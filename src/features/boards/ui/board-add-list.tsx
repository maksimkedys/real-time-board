'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface BoardAddListProps {
  onAddList: (title: string) => Promise<void>;
}

export function BoardAddList({ onAddList }: BoardAddListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onAddList(newTitle);
    setNewTitle('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="w-72 shrink-0 rounded-xl bg-muted/50 p-3 shadow-sm border border-border/50">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            autoFocus
            placeholder="Enter list title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={100}
            className="bg-card shadow-sm border-primary/30 focus-visible:ring-primary/30"
          />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="cursor-pointer">
              Add list
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setIsAdding(false);
                setNewTitle('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsAdding(true)}
      className="flex w-72 h-12 shrink-0 justify-start bg-card/40 hover:bg-card border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground cursor-pointer transition-all rounded-xl shadow-sm"
    >
      <Plus className="mr-2 h-4 w-4" />
      Add another list
    </Button>
  );
}

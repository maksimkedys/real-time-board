'use client';

import { Plus, Loader2, Building2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useWorkspaceSwitcher } from '../hooks/use-workspace-switcher';
import { Workspace } from '@/shared/types/models.types';

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  onItemClick?: () => void;
}

export function WorkspaceSwitcher({
  workspaces,
  onItemClick,
}: WorkspaceSwitcherProps) {
  const {
    activeWorkspaceId,
    isOpen,
    setIsOpen,
    newWorkspaceName,
    setNewWorkspaceName,
    isLoading,
    handleSelectWorkspace,
    handleCreateWorkspace,
  } = useWorkspaceSwitcher(workspaces, onItemClick);

  return (
    <>
      <div className="flex items-center gap-2">
        {workspaces.length <= 1 ? (
          <div className="flex-1 flex items-center gap-2 px-2 py-1.5 min-h-8">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium truncate">
              {workspaces[0]?.name || 'No workspace'}
            </span>
          </div>
        ) : (
          <Select
            value={activeWorkspaceId || ''}
            onValueChange={handleSelectWorkspace}
          >
            <SelectTrigger className="w-full bg-transparent border-none shadow-none focus:ring-0">
              <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.id}>
                  {ws.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Create workspace"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateWorkspace}>
            <DialogHeader>
              <DialogTitle>Create Workspace</DialogTitle>
              <DialogDescription>
                Workspaces help you organize your boards and collaborate with
                your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Workspace Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="e.g. Acme Corp"
                    className="pl-9"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !newWorkspaceName.trim()}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

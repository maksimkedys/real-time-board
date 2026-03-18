'use client';

import { Loader2, X, ShieldAlert } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { useWorkspaceMembersModal } from '../hooks/use-workspace-members-modal';

interface WorkspaceMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
}

export function WorkspaceMembersModal({
  isOpen,
  onClose,
  workspaceId,
}: WorkspaceMembersModalProps) {
  const {
    members,
    isLoading,
    error,
    removeMember,
    emailValue,
    isSubmitting,
    handleInvite,
    handleOpenChange,
    handleEmailChange,
  } = useWorkspaceMembersModal(workspaceId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => handleOpenChange(open, onClose)}
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Workspace Members</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on all boards in this workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="flex gap-2 mt-4">
          <Input
            placeholder="name@example.com"
            type="email"
            value={emailValue}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !emailValue.trim()}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Invite'
            )}
          </Button>
        </form>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive mt-2 bg-destructive/10 p-2 rounded-md">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Current Members ({members.length})
          </h4>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage
                        src={member.profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback className="uppercase bg-primary/10 text-primary">
                        {member.profiles?.full_name?.charAt(0) ||
                          member.profiles?.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {member.profiles?.full_name || 'No Name'}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {member.profiles?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-md">
                      {member.role}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMember(member.id)}
                      title="Remove member"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

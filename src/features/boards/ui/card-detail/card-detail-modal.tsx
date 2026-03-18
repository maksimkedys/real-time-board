'use client';

import { CreditCard } from 'lucide-react';

import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { Card } from '@/shared/types/models.types';

import { CardDescription } from './card-description';
import { CardActivitySection } from './card-activity-section';
import { CardSidebar } from './card-sidebar';
import { useCardDetails } from '../../hooks/use-card-details';
import { useCardAssignees } from '../../hooks/use-card-assignees';
import { useCardDetailModal } from '../../hooks/use-card-detail-modal';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  columnTitle: string;
  onUpdate: (id: string, updates: Partial<Card>) => void;
  onDelete: (id: string) => void;
}

export function CardDetailModal({
  isOpen,
  onClose,
  card,
  columnTitle,
  onUpdate,
  onDelete,
}: CardDetailModalProps) {
  const { activities, currentUser, isLoadingActivities, logActivity } =
    useCardDetails(card.id, isOpen);
  const { assignees, availableUsers, toggleAssignee, isLoadingAssignees } =
    useCardAssignees(card.id);

  const {
    title,
    setTitle,
    description,
    setDescription,
    isEditingDesc,
    setIsEditingDesc,
    comment,
    setComment,
    handleTitleBlur,
    handleSaveDescription,
    handleAddComment,
    handleSetDueDate,
  } = useCardDetailModal(card, isOpen, onUpdate, logActivity);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[768px] h-[90vh] sm:h-[600px] flex flex-col p-0 gap-0 bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="sr-only">Edit card: {card.title}</DialogTitle>
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-muted-foreground mt-1.5" />
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                className="text-xl font-semibold border-transparent px-1 -ml-1 h-8 focus-visible:ring-1 focus-visible:border-border shadow-none bg-transparent"
              />
              <p className="text-sm text-muted-foreground mt-0.5 px-1">
                in list{' '}
                <span className="underline decoration-muted-foreground/30">
                  {columnTitle}
                </span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-8 pb-6">
              <CardDescription
                description={description}
                setDescription={setDescription}
                isEditing={isEditingDesc}
                setIsEditing={setIsEditingDesc}
                onSave={handleSaveDescription}
              />
              <CardActivitySection
                currentUser={currentUser}
                comment={comment}
                setComment={setComment}
                onAddComment={handleAddComment}
                activities={activities}
                isLoading={isLoadingActivities}
              />
            </div>
          </ScrollArea>

          <CardSidebar
            assignees={assignees}
            availableUsers={availableUsers}
            isLoadingAssignees={isLoadingAssignees}
            toggleAssignee={toggleAssignee}
            dueDate={card.due_date}
            onSetDueDate={handleSetDueDate}
            onDelete={() => {
              onDelete(card.id);
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

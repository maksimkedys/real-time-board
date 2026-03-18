'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string | null) => void;
  initialData?: { title: string; description: string | null };
  modalTitle?: string;
  submitButtonText?: string;
}

export function CardModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  modalTitle = 'Card Details',
  submitButtonText = 'Save',
}: CardModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
    }
  }

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim() || null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Card Title</label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="min-h-[150px] resize-none focus-visible:ring-primary/30"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

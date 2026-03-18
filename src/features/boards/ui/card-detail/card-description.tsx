'use client';

import { AlignLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface CardDescriptionProps {
  description: string;
  setDescription: (val: string) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onSave: () => void;
}

export function CardDescription({
  description,
  setDescription,
  isEditing,
  setIsEditing,
  onSave,
}: CardDescriptionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <AlignLeft className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Description</h3>
      </div>
      <div className="pl-8">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="min-h-[120px] resize-y focus-visible:ring-primary/30"
            />
            <div className="flex gap-2">
              <Button onClick={onSave} size="sm">
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-lg p-3 min-h-[80px] cursor-pointer text-sm"
          >
            {description ? (
              <p className="whitespace-pre-wrap">{description}</p>
            ) : (
              <p className="text-muted-foreground">
                Add a more detailed description...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

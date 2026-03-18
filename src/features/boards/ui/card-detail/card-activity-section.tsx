'use client';

import { Activity, Loader2, Send } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Profile } from '@/shared/types/models.types';
import { CardActivityWithProfile } from '../../hooks/use-card-details';

interface CardActivitySectionProps {
  currentUser: Profile | null;
  comment: string;
  setComment: (val: string) => void;
  onAddComment: () => void;
  activities: CardActivityWithProfile[];
  isLoading: boolean;
}

export function CardActivitySection({
  currentUser,
  comment,
  setComment,
  onAddComment,
  activities,
  isLoading,
}: CardActivitySectionProps) {
  const formatDate = (isoString: string | null) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Activity</h3>
      </div>

      <div className="pl-8 space-y-4">
        <div className="flex gap-3 items-start">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {currentUser?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
              placeholder="Write a comment..."
              className="h-8"
            />
            <Button
              size="sm"
              className="h-8 px-3"
              onClick={onAddComment}
              disabled={!comment.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={activity.profiles?.avatar_url || undefined}
                  />
                  <AvatarFallback className="text-xs uppercase">
                    {activity.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p>
                    <span className="font-semibold text-foreground">
                      {activity.profiles?.full_name || 'Unknown User'}
                    </span>{' '}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

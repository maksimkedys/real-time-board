import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';

export const useBoardPresence = (boardId: string) => {
  const supabase = createSupabaseBrowserClient();
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (!boardId || !supabase) return;

    let channel: ReturnType<typeof supabase.channel>;

    const initPresence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      channel = supabase.channel(`board_presence:${boardId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState<Profile>();

          const users = Object.values(newState)
            .flat()
            .filter((user) => user !== null) as Profile[];

          const uniqueUsers = Array.from(
            new Map(users.map((u) => [u.id, u])).values()
          );

          setActiveUsers(uniqueUsers);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track(profile);
          }
        });
    };

    initPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [boardId, supabase]);

  return { activeUsers };
};

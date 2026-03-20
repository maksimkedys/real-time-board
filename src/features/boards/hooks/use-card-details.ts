import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile, CardActivityWithProfile } from '@/shared/types/models.types';

export type { CardActivityWithProfile };

export const useCardDetails = (cardId: string, isOpen: boolean) => {
  const supabase = createSupabaseBrowserClient();

  const [activities, setActivities] = useState<CardActivityWithProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(data);
      }
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (!isOpen || !cardId || !supabase) return;

    const fetchActivities = async () => {
      setIsLoadingActivities(true);
      try {
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('card_activity')
          .select(`id, action, created_at, profiles(full_name, avatar_url)`)
          .eq('card_id', cardId)
          .order('created_at', { ascending: false });

        if (activitiesError) throw activitiesError;

        const mapped: CardActivityWithProfile[] = (activitiesData ?? []).map(
          (row) => ({
            id: row.id,
            action: row.action,
            created_at: row.created_at,
            profiles: row.profiles,
          })
        );
        setActivities(mapped);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [cardId, isOpen, supabase]);

  const logActivity = async (action: string) => {
    try {
      if (!currentUser || !supabase) return;

      const { data, error } = await supabase
        .from('card_activity')
        .insert({ card_id: cardId, user_id: currentUser.id, action })
        .select(`id, action, created_at, profiles(full_name, avatar_url)`)
        .single();

      if (error) throw error;

      if (data) {
        const activity: CardActivityWithProfile = {
          id: data.id,
          action: data.action,
          created_at: data.created_at,
          profiles: data.profiles,
        };
        setActivities((prev) => [activity, ...prev]);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { activities, currentUser, isLoadingActivities, logActivity };
};

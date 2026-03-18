import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';

interface Assignee {
  profiles: {
    avatar_url: string | null;
    created_at: string | null;
    email: string | null;
    full_name: string | null;
    id: string;
  } | null;
}

export const useCardAssignees = (cardId: string) => {
  const supabase = createSupabaseBrowserClient();
  const [assignees, setAssignees] = useState<Profile[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      setIsLoadingAssignees(true);
      try {
        const { data: assigneesData } = await supabase
          .from('card_assignees')
          .select('profiles(*)')
          .eq('card_id', cardId);

        if (assigneesData) {
          const cleanAssignees = assigneesData
            .map((a: Assignee) => a.profiles)
            .filter(Boolean);
          setAssignees(cleanAssignees as Profile[]);
        }

        const { data: usersData } = await supabase.from('profiles').select('*');
        if (usersData) {
          setAvailableUsers(usersData as Profile[]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingAssignees(false);
      }
    };

    if (cardId) fetchData();
  }, [cardId, supabase]);

  const toggleAssignee = async (user: Profile) => {
    if (!supabase) return;

    const isAssigned = assignees.some((a) => a.id === user.id);

    try {
      if (isAssigned) {
        setAssignees((prev) => prev.filter((a) => a.id !== user.id));
        await supabase
          .from('card_assignees')
          .delete()
          .match({ card_id: cardId, user_id: user.id });
      } else {
        setAssignees((prev) => [...prev, user]);
        await supabase
          .from('card_assignees')
          .insert({ card_id: cardId, user_id: user.id });
      }
    } catch (error) {
      console.error('Error toggling assignee:', error);
    }
  };

  return { assignees, availableUsers, toggleAssignee, isLoadingAssignees };
};

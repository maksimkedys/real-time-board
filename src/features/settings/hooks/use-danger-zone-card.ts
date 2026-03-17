import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';

export const useDangerZoneCard = (profile: Profile | null) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleDeleteAccount = async () => {
    if (!profile?.id) return;

    const isConfirmed = window.confirm(
      'Are you sure you want to delete your account? All your boards and data will be permanently removed.'
    );

    if (!isConfirmed || !supabase) return;

    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (error) throw error;

      await supabase.auth.signOut();

      router.push('/sign-up');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDeleteAccount,
  };
};

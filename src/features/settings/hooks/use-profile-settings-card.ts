import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';
import { profileUpdateSchema } from '@/shared/schemas/workspace.schema';

export const useProfileSettingsCard = (profile: Profile | null) => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id || !supabase) return;

    try {
      setIsUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      router.refresh();
    } catch (error) {
      console.error('Error of downloading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.id || fullName === profile?.full_name || !supabase) return;

    const parsed = profileUpdateSchema.safeParse({
      fullName,
      profileId: profile.id,
    });
    if (!parsed.success) return;

    try {
      setIsSavingName(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: parsed.data.fullName })
        .eq('id', parsed.data.profileId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSavingName(false);
    }
  };

  return {
    fullName,
    setFullName,
    isSavingName,
    isUploadingAvatar,
    fileInputRef,
    handleAvatarUpload,
    handleSaveProfile,
  };
};

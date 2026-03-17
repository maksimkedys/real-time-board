import {
  useState,
  useRef,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  RefObject,
} from 'react';
import { useRouter } from 'next/navigation';

import { useSessionStore } from '@/entities/session/model/session.store';
import { createSupabaseBrowserClient } from '@/shared/api/supabase/client';
import { Profile } from '@/shared/types/models.types';

interface Output {
  profile: Profile | null;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  isSavingName: boolean;
  isUploadingAvatar: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSaveProfile: () => Promise<void>;
}

export const useProfileSettingsCard = (): Output => {
  const router = useRouter();
  const profile = useSessionStore((state) => state.profile);
  const updateProfile = useSessionStore((state) => state.updateProfile);

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

      if (updateProfile) updateProfile({ avatar_url: publicUrl });
      router.refresh();
    } catch (error) {
      console.error('Error of downloading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.id || fullName === profile?.full_name || !supabase) return;

    try {
      setIsSavingName(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id);

      if (error) throw error;

      if (updateProfile) updateProfile({ full_name: fullName });
      router.refresh();
    } catch (error) {
      console.error('Error profile update:', error);
    } finally {
      setIsSavingName(false);
    }
  };

  return {
    profile,
    fullName,
    setFullName,
    isSavingName,
    isUploadingAvatar,
    fileInputRef,
    handleAvatarUpload,
    handleSaveProfile,
  };
};

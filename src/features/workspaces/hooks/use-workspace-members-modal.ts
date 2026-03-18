import { useState } from 'react';
import { useWorkspaceMembers } from './use-workspace-members';

export const useWorkspaceMembersModal = (workspaceId: string | null) => {
  const {
    members,
    isLoading,
    error,
    addMemberByEmail,
    removeMember,
    setError,
  } = useWorkspaceMembers(workspaceId);

  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) return;

    setIsSubmitting(true);
    const success = await addMemberByEmail(emailValue);
    setIsSubmitting(false);

    if (success) {
      setEmailValue('');
    }
  };

  const handleOpenChange = (open: boolean, onClose: () => void) => {
    if (!open) {
      onClose();
      setError(null);
      setEmailValue('');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    if (error) setError(null);
  };

  return {
    members,
    isLoading,
    error,
    removeMember,
    emailValue,
    isSubmitting,
    handleInvite,
    handleOpenChange,
    handleEmailChange,
  };
};

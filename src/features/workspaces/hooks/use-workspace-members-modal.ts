import { useState } from 'react';
import { useWorkspaceMembers } from './use-workspace-members';

export const useWorkspaceMembersModal = (workspaceId: string | null) => {
  const {
    members,
    isLoading,
    error,
    inviteMemberByEmail,
    removeMember,
    setError,
  } = useWorkspaceMembers(workspaceId);

  const [emailValue, setEmailValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    const success = await inviteMemberByEmail(emailValue);
    setIsSubmitting(false);

    if (success) {
      setSuccessMessage(`Invitation sent to ${emailValue}`);
      setEmailValue('');
    }
  };

  const handleOpenChange = (open: boolean, onClose: () => void) => {
    if (!open) {
      onClose();
      setError(null);
      setSuccessMessage(null);
      setEmailValue('');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  return {
    members,
    isLoading,
    error,
    successMessage,
    removeMember,
    emailValue,
    isSubmitting,
    handleInvite,
    handleOpenChange,
    handleEmailChange,
  };
};

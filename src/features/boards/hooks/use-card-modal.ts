import { useState } from 'react';

export const useCardModal = (
  isOpen: boolean,
  onClose: () => void,
  onSave: (
    title: string,
    description: string | null,
    dueDate: string | null
  ) => void,
  initialData?: {
    title: string;
    description: string | null;
    due_date?: string | null;
  }
) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [dueDate, setDueDate] = useState<string | null>(
    initialData?.due_date || null
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setDueDate(initialData?.due_date || null);
    }
  }

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim() || null, dueDate);
    setTitle('');
    setDescription('');
    setDueDate(null);
    onClose();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    handleSave,
  };
};

import { useState } from 'react';
import { Card } from '@/shared/types/models.types';

export const useCardDetailModal = (
  card: Card,
  isOpen: boolean,
  onUpdate: (id: string, updates: Partial<Card>) => void,
  logActivity: (action: string) => void
) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [comment, setComment] = useState('');

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTitle(card.title);
      setDescription(card.description || '');
      setIsEditingDesc(false);
      setComment('');
    }
  }

  const handleTitleBlur = () => {
    if (title.trim() && title !== card.title) {
      onUpdate(card.id, { title: title.trim() });
      logActivity(`renamed the card to "${title.trim()}"`);
    } else {
      setTitle(card.title);
    }
  };

  const handleSaveDescription = () => {
    onUpdate(card.id, { description: description.trim() || null });
    setIsEditingDesc(false);
    logActivity('updated the description');
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    logActivity(`left a comment: "${comment.trim()}"`);
    setComment('');
  };

  const handleSetDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onUpdate(card.id, { due_date: newDate || null });
    logActivity(
      newDate ? `set the due date to ${newDate}` : 'removed the due date'
    );
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    isEditingDesc,
    setIsEditingDesc,
    comment,
    setComment,
    handleTitleBlur,
    handleSaveDescription,
    handleAddComment,
    handleSetDueDate,
  };
};

'use client';

import { useRef } from 'react';
import { useSessionStore } from '../model/session.store';
import type { Workspace, Profile } from '@/shared/types/models.types';

export function SessionInitializer({
  profile,
  workspaces,
}: {
  profile: Profile | null;
  workspaces: Workspace[];
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useSessionStore.getState().setSession(profile, workspaces);
    initialized.current = true;
  }

  return null;
}

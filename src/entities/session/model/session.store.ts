import { create } from 'zustand';
import type { Workspace, Profile } from '@/shared/types/models.types';

interface SessionState {
  profile: Profile | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setSession: (profile: Profile | null, workspaces: Workspace[]) => void;
  setActiveWorkspace: (id: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  workspaces: [],
  activeWorkspaceId: null,
  setSession: (profile, workspaces) =>
    set({
      profile,
      workspaces,
      activeWorkspaceId: workspaces.length > 0 ? workspaces[0].id : null,
    }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
}));

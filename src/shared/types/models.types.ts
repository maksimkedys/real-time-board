import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Profile = Tables<'profiles'>;
export type Workspace = Tables<'workspaces'>;
export type Board = Tables<'boards'>;
export type Column = Tables<'columns'>;
export type Card = Tables<'cards'>;
export type Assignees = Tables<'card_assignees'>;
export type WorkspaceInvitation = Tables<'workspace_invitations'>;

export type CardInsert = TablesInsert<'cards'>;
export type CardUpdate = TablesUpdate<'cards'>;

export interface WorkspaceMemberWithProfile {
  id: string;
  role: string | null;
  user_id: string | null;
  profiles: Profile | null;
}

export interface CardActivityWithProfile {
  id: string;
  action: string | null;
  created_at: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

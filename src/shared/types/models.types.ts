import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Profile = Tables<'profiles'>;
export type Workspace = Tables<'workspaces'>;
export type Board = Tables<'boards'>;
export type Column = Tables<'columns'>;
export type Card = Tables<'cards'>;
export type Assignees = Tables<'card_assignees'>;

export type CardInsert = TablesInsert<'cards'>;
export type CardUpdate = TablesUpdate<'cards'>;

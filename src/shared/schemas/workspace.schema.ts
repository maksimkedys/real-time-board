import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid UUID format');

export const userIdSchema = z.object({
  userId: uuidSchema,
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  profileId: uuidSchema,
});

export const workspaceNameSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
export type WorkspaceNameValues = z.infer<typeof workspaceNameSchema>;

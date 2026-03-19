import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid UUID format');

export const boardIdSchema = z.object({
  boardId: uuidSchema,
});

export const workspaceIdSchema = z.object({
  workspaceId: uuidSchema,
});

export const createBoardSchema = z.object({
  title: z.string().min(1, 'Board title is required').max(100),
  workspaceId: uuidSchema,
});

export const renameBoardSchema = z.object({
  title: z.string().min(1, 'Board title is required').max(100),
  boardId: uuidSchema,
});

export const columnTitleSchema = z.object({
  title: z.string().min(1, 'Column title is required').max(100),
  boardId: uuidSchema,
});

export const cardSchema = z.object({
  title: z.string().min(1, 'Card title is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  dueDate: z.string().nullable().optional(),
  columnId: uuidSchema,
});

export type CreateBoardValues = z.infer<typeof createBoardSchema>;
export type RenameBoardValues = z.infer<typeof renameBoardSchema>;
export type CardValues = z.infer<typeof cardSchema>;

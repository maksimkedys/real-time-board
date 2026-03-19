import {
  boardIdSchema,
  workspaceIdSchema,
  createBoardSchema,
  renameBoardSchema,
  columnTitleSchema,
  cardSchema,
} from '@/shared/schemas/board.schema';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Board Schemas', () => {
  describe('boardIdSchema', () => {
    it('should accept a valid UUID', () => {
      const result = boardIdSchema.safeParse({ boardId: validUUID });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid UUID', () => {
      const result = boardIdSchema.safeParse({ boardId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('should reject an empty string', () => {
      const result = boardIdSchema.safeParse({ boardId: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('workspaceIdSchema', () => {
    it('should accept a valid UUID', () => {
      const result = workspaceIdSchema.safeParse({ workspaceId: validUUID });
      expect(result.success).toBe(true);
    });

    it('should reject non-UUID strings', () => {
      const result = workspaceIdSchema.safeParse({ workspaceId: '12345' });
      expect(result.success).toBe(false);
    });
  });

  describe('createBoardSchema', () => {
    it('should accept valid data', () => {
      const result = createBoardSchema.safeParse({
        title: 'My Board',
        workspaceId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createBoardSchema.safeParse({
        title: '',
        workspaceId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 chars', () => {
      const result = createBoardSchema.safeParse({
        title: 'a'.repeat(101),
        workspaceId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid workspaceId', () => {
      const result = createBoardSchema.safeParse({
        title: 'Board',
        workspaceId: 'bad',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('renameBoardSchema', () => {
    it('should accept valid data', () => {
      const result = renameBoardSchema.safeParse({
        title: 'Renamed Board',
        boardId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = renameBoardSchema.safeParse({
        title: '',
        boardId: validUUID,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('columnTitleSchema', () => {
    it('should accept valid data', () => {
      const result = columnTitleSchema.safeParse({
        title: 'To Do',
        boardId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = columnTitleSchema.safeParse({
        title: '',
        boardId: validUUID,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('cardSchema', () => {
    it('should accept valid card with all fields', () => {
      const result = cardSchema.safeParse({
        title: 'My Card',
        description: 'A description',
        dueDate: '2026-12-31',
        columnId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should accept card with null optional fields', () => {
      const result = cardSchema.safeParse({
        title: 'My Card',
        description: null,
        dueDate: null,
        columnId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should accept card without optional fields', () => {
      const result = cardSchema.safeParse({
        title: 'My Card',
        columnId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = cardSchema.safeParse({
        title: '',
        columnId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 200 chars', () => {
      const result = cardSchema.safeParse({
        title: 'a'.repeat(201),
        columnId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid columnId', () => {
      const result = cardSchema.safeParse({
        title: 'Card',
        columnId: 'bad-id',
      });
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 2000 chars', () => {
      const result = cardSchema.safeParse({
        title: 'Card',
        description: 'a'.repeat(2001),
        columnId: validUUID,
      });
      expect(result.success).toBe(false);
    });
  });
});

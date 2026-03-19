import {
  userIdSchema,
  profileUpdateSchema,
  workspaceNameSchema,
} from '@/shared/schemas/workspace.schema';

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Workspace Schemas', () => {
  describe('userIdSchema', () => {
    it('should accept a valid UUID', () => {
      const result = userIdSchema.safeParse({ userId: validUUID });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid UUID', () => {
      const result = userIdSchema.safeParse({ userId: 'abc' });
      expect(result.success).toBe(false);
    });

    it('should reject missing userId', () => {
      const result = userIdSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('profileUpdateSchema', () => {
    it('should accept valid profile update', () => {
      const result = profileUpdateSchema.safeParse({
        fullName: 'John Doe',
        profileId: validUUID,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty fullName', () => {
      const result = profileUpdateSchema.safeParse({
        fullName: '',
        profileId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject fullName longer than 100 chars', () => {
      const result = profileUpdateSchema.safeParse({
        fullName: 'a'.repeat(101),
        profileId: validUUID,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid profileId', () => {
      const result = profileUpdateSchema.safeParse({
        fullName: 'John',
        profileId: 'not-uuid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('workspaceNameSchema', () => {
    it('should accept valid workspace name', () => {
      const result = workspaceNameSchema.safeParse({ name: 'My Workspace' });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = workspaceNameSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 100 chars', () => {
      const result = workspaceNameSchema.safeParse({
        name: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const result = workspaceNameSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});

import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
} from '@/shared/schemas/auth.schema';

describe('Auth Schemas', () => {
  describe('signUpSchema', () => {
    it('should accept valid sign up data', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John Doe',
        email: 'test@example.com',
        password: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty fullName', () => {
      const result = signUpSchema.safeParse({
        fullName: '',
        email: 'test@example.com',
        password: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John',
        email: 'invalid-email',
        password: '123456',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John',
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = signUpSchema.safeParse({
        fullName: 'John',
        email: '',
        password: '123456',
      });
      expect(result.success).toBe(false);
    });

    it('should reject fullName with 1 character', () => {
      const result = signUpSchema.safeParse({
        fullName: 'J',
        email: 'test@example.com',
        password: '123456',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signInSchema', () => {
    it('should accept valid sign in data', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = signInSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = signInSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should accept valid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'bad',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: '',
      });
      expect(result.success).toBe(false);
    });
  });
});

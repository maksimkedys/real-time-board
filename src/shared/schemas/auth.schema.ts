import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

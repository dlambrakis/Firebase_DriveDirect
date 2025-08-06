import { z } from 'zod';

/**
 * Schema for validating user sign-in credentials.
 * Requires a valid email and a password of at least 8 characters.
 */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

/**
 * Schema for validating user sign-up credentials.
 * Requires a valid email, a password of at least 8 characters, and a matching confirmation password.
 */
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Schema for validating a password update.
 * Requires a new password of at least 8 characters and a matching confirmation password.
 */
export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


// --- Inferred Types ---

/**
 * Represents the input data for a sign-in operation.
 */
export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Represents the input data for a sign-up operation.
 */
export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Represents the input data for a password update operation.
 */
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

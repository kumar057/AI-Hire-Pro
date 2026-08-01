import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => !value || /^\+?[1-9]\d{7,14}$/.test(value.replace(/[\s().-]/g, '')), {
    message: 'Enter a valid phone number',
  });

export const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters')
  .max(72, 'Use 72 characters or fewer')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/\d/, 'Add a number')
  .regex(/[^A-Za-z0-9]/, 'Add a special character');

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const baseRegisterSchema = z
  .object({
    first_name: z.string().trim().min(1, 'First name is required').max(100),
    last_name: z.string().trim().min(1, 'Last name is required').max(100),
    email: z.string().trim().email('Enter a valid email'),
    phone: phoneSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your password'),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  });

export const candidateRegisterSchema = baseRegisterSchema;

export const companyRegisterSchema = baseRegisterSchema.extend({
  company_name: z.string().trim().min(2, 'Company name is required').max(180),
  website: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
  industry: z.string().trim().optional(),
  company_size: z.string().trim().optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().max(4000).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(20, 'Reset token is required'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your password'),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  });

export const profileSetupSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  phone: phoneSchema,
  avatar: z.string().trim().url('Enter a valid URL').optional().or(z.literal('')),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CandidateRegisterFormValues = z.infer<typeof candidateRegisterSchema>;
export type CompanyRegisterFormValues = z.infer<typeof companyRegisterSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

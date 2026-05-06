import { z } from 'zod'
import { headers } from 'next/headers'
import { type RateLimitConfig } from '@/lib/rate-limit'
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_PATTERNS,
} from '@/lib/password-validation'
import { profileSlugSchema as profileSlugFieldSchema } from '@/lib/profile-slug'

export const AUTH_RATE_LIMITS = {
  signIn: { maxAttempts: 5, windowMs: 60_000 } satisfies RateLimitConfig,
  signUp: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  forgotPassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  resetPassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  changePassword: { maxAttempts: 3, windowMs: 600_000 } satisfies RateLimitConfig,
  updateProfileSlug: { maxAttempts: 5, windowMs: 60_000 } satisfies RateLimitConfig,
}

export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  )
}

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  )
  .regex(
    PASSWORD_PATTERNS.uppercase,
    'Password must contain at least one uppercase letter'
  )
  .regex(
    PASSWORD_PATTERNS.lowercase,
    'Password must contain at least one lowercase letter'
  )
  .regex(PASSWORD_PATTERNS.number, 'Password must contain at least one number')
  .regex(
    PASSWORD_PATTERNS.special,
    'Password must contain at least one special character'
  )

export const displayNameSchema = z
  .string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be at most 50 characters')
  .trim()

export const signUpSchema = z.object({
  displayName: displayNameSchema,
  profileSlug: profileSlugFieldSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

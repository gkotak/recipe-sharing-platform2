import { User } from '@supabase/supabase-js'

/**
 * Common authentication error messages (shared between server and client)
 */
export const AUTH_MESSAGES = {
  LOGIN_REQUIRED: 'You need to be logged in to perform this action',
  LIKE_REQUIRED: 'You need to be logged in to like or review a recipe',
  OWNERSHIP_REQUIRED: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, number, and special character',
} as const

/**
 * Client-side authentication utilities
 * These work with the Supabase client in client components
 */

/**
 * Check if a user object represents an authenticated user
 * @param user - User object from Supabase
 * @returns boolean - True if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user
}

/**
 * Get user display name from user object
 * @param user - User object from Supabase
 * @returns string - Display name or email fallback
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Unknown'
  
  // Try to get name from user metadata first
  const fullName = user.user_metadata?.full_name
  if (fullName) return fullName
  
  // Fallback to email
  return user.email || 'Unknown'
}

/**
 * Check if user owns a resource
 * @param user - User object from Supabase
 * @param resourceUserId - The user ID of the resource owner
 * @returns boolean - True if user owns the resource
 */
export function isResourceOwner(user: User | null, resourceUserId: string): boolean {
  return !!user && user.id === resourceUserId
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @throws Error if password doesn't meet requirements
 */
export function validatePassword(password: string): void {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const missing = []
  if (!hasUpperCase) missing.push("uppercase letter")
  if (!hasNumber) missing.push("number")
  if (!hasSpecialChar) missing.push("special character")
  
  if (missing.length > 0) {
    throw new Error(AUTH_MESSAGES.WEAK_PASSWORD)
  }
}

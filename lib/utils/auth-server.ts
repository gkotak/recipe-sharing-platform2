import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'

/**
 * Get the current authenticated user from server-side
 * @returns Promise<User | null> - The authenticated user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Require authentication for server actions
 * @param message - Optional custom message to show on redirect
 * @returns Promise<User> - The authenticated user
 * @throws Redirects to sign-in page if not authenticated
 */
export async function requireAuth(message?: string): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    const defaultMessage = 'You need to be logged in to perform this action'
    redirect(`/auth/sign-in?message=${encodeURIComponent(message || defaultMessage)}`)
  }
  
  return user
}

/**
 * Check if the current user owns a resource
 * @param resourceUserId - The user ID of the resource owner
 * @returns Promise<boolean> - True if current user owns the resource
 */
export async function isResourceOwner(resourceUserId: string): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user && user.id === resourceUserId
}

/**
 * Require ownership of a resource for server actions
 * @param resourceUserId - The user ID of the resource owner
 * @param message - Optional custom message to show on redirect
 * @returns Promise<User> - The authenticated user
 * @throws Redirects to sign-in page if not authenticated or not owner
 */
export async function requireOwnership(resourceUserId: string, message?: string): Promise<User> {
  const user = await requireAuth(message)
  
  if (user.id !== resourceUserId) {
    const defaultMessage = 'You do not have permission to perform this action'
    redirect(`/auth/sign-in?message=${encodeURIComponent(message || defaultMessage)}`)
  }
  
  return user
}

/**
 * Get authentication status and user info for server components
 * @returns Object with authentication status and user info
 */
export async function getAuthStatus() {
  const user = await getCurrentUser()
  
  return {
    isAuthenticated: !!user,
    user: user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    } : null
  }
}

/**
 * Common authentication error messages
 */
export const AUTH_MESSAGES = {
  LOGIN_REQUIRED: 'You need to be logged in to perform this action',
  LIKE_REQUIRED: 'You need to be logged in to like or review a recipe',
  OWNERSHIP_REQUIRED: 'You do not have permission to perform this action',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, number, and special character',
} as const

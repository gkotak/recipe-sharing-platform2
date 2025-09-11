import { AUTH_MESSAGES } from './auth-client'

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
}

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = any> {
  success: true
  data: T
}

/**
 * Union type for API responses
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string, 
  code?: string, 
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: message,
    code,
    details
  }
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data
  }
}

/**
 * Handle Supabase errors and convert to user-friendly messages
 */
export function handleSupabaseError(error: any): string {
  if (!error) return 'An unexpected error occurred'
  
  // Handle specific Supabase error codes
  switch (error.code) {
    case '23505': // Unique constraint violation
      return 'This item already exists'
    case '23503': // Foreign key constraint violation
      return 'Cannot delete this item as it is referenced by other data'
    case '42501': // Insufficient privilege
      return 'You do not have permission to perform this action'
    case 'PGRST116': // Row Level Security violation
      return 'Access denied'
    default:
      return error.message || 'An unexpected error occurred'
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: any): string {
  if (!error) return AUTH_MESSAGES.LOGIN_REQUIRED
  
  switch (error.message) {
    case 'Invalid login credentials':
      return AUTH_MESSAGES.INVALID_CREDENTIALS
    case 'User already registered':
      return AUTH_MESSAGES.ACCOUNT_EXISTS
    case 'Password should be at least 6 characters':
      return AUTH_MESSAGES.WEAK_PASSWORD
    default:
      return error.message || AUTH_MESSAGES.LOGIN_REQUIRED
  }
}

/**
 * Log error for debugging while returning user-friendly message
 */
export function logAndReturnError(
  error: any, 
  context: string, 
  userMessage?: string
): string {
  console.error(`Error in ${context}:`, error)
  return userMessage || handleSupabaseError(error)
}

/**
 * Validate required fields and return error if missing
 */
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      return `${field} is required`
    }
  }
  return null
}

/**
 * Safe async operation wrapper with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    const errorMessage = logAndReturnError(error, context)
    return { 
      success: false, 
      error: errorMessage, 
      data: fallback 
    }
  }
}

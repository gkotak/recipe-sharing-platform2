import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

type TableName = keyof Database['public']['Tables']

// Common table name variations for different entities
export const TABLE_VARIATIONS = {
  likes: ['recipe_likes', 'likes'] as const,
  comments: ['comments', 'recipe_comments'] as const,
} as const

export type TableVariation = keyof typeof TABLE_VARIATIONS

/**
 * Tries multiple table names for a given operation until one succeeds
 * @param supabase - Supabase client instance
 * @param variation - The type of table to try (likes, comments)
 * @param operation - Function that performs the operation with a table name
 * @returns Promise that resolves to the result of the first successful operation
 */
export async function tryTableVariations<T>(
  supabase: SupabaseClient<Database>,
  variation: TableVariation,
  operation: (tableName: string) => Promise<{ data: any; error: any }>
): Promise<{ data: T | null; error: any }> {
  const tableNames = TABLE_VARIATIONS[variation]
  
  for (const tableName of tableNames) {
    try {
      const result = await operation(tableName)
      if (!result.error) {
        return result
      }
    } catch (error) {
      // Continue to next table name if this one fails
      continue
    }
  }
  
  // If all table names failed, return the last error
  return { data: null, error: new Error(`All table variations failed for ${variation}`) }
}

/**
 * Tries multiple table names for a mutation operation (insert, update, delete)
 * @param supabase - Supabase client instance
 * @param variation - The type of table to try (likes, comments)
 * @param operation - Function that performs the mutation with a table name
 * @returns Promise that resolves to true if any operation succeeded, false otherwise
 */
export async function tryTableVariationsMutation(
  supabase: SupabaseClient<Database>,
  variation: TableVariation,
  operation: (tableName: string) => Promise<{ error: any }>
): Promise<boolean> {
  const tableNames = TABLE_VARIATIONS[variation]
  
  for (const tableName of tableNames) {
    try {
      const result = await operation(tableName)
      if (!result.error) {
        return true
      }
    } catch (error) {
      // Continue to next table name if this one fails
      continue
    }
  }
  
  return false
}

/**
 * Gets the first available table name for a given variation
 * @param supabase - Supabase client instance
 * @param variation - The type of table to check
 * @returns Promise that resolves to the first available table name or null
 */
export async function getAvailableTableName(
  supabase: SupabaseClient<Database>,
  variation: TableVariation
): Promise<string | null> {
  const tableNames = TABLE_VARIATIONS[variation]
  
  for (const tableName of tableNames) {
    try {
      // Try a simple select to see if the table exists and is accessible
      const { error } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1)
      
      if (!error) {
        return tableName
      }
    } catch (error) {
      // Continue to next table name if this one fails
      continue
    }
  }
  
  return null
}

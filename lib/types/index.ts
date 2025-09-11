import { Database } from '@/lib/supabase/types'

// Base recipe type from database
export type Recipe = Database['public']['Tables']['recipes']['Row']

// Recipe with profile information (commonly used across components)
export type RecipeWithProfile = Recipe & {
  profiles: {
    full_name: string | null
  } | null
}

// Comment type (for comments functionality)
export type Comment = {
  id: string
  content: string
  created_at: string
  user_id: string
  recipe_id: string
}

// Comment with profile information
export type CommentWithProfile = Comment & {
  profiles: {
    full_name: string | null
  } | null
}

// Like type (for likes functionality)
export type Like = {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

// Profile type
export type Profile = Database['public']['Tables']['profiles']['Row']

// Auth form types
export type AuthMode = 'sign-in' | 'sign-up'

// Recipe form data type
export type RecipeFormData = {
  title: string
  description: string
  ingredients: string[]
  cooking_time: string
  difficulty: string
  category: string
}

// Common component props
export interface BaseComponentProps {
  className?: string
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  difficulty?: string
  cookingTime?: number
}

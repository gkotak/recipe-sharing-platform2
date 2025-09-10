export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: number
          created_at: string
          user_id: string
          title: string
          description: string | null
          ingredients: string[]
          cooking_time: number
          difficulty: string
          category: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          title: string
          description?: string | null
          ingredients: string[]
          cooking_time: number
          difficulty: string
          category: string
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          title?: string
          description?: string | null
          ingredients?: string[]
          cooking_time?: number
          difficulty?: string
          category?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
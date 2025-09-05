export type Profile = {
  id: string
  username: string
  full_name: string
  created_at: string
  updated_at: string
}

export type Recipe = {
  id: string
  created_at: string
  user_id: string
  title: string
  ingredients: string
  instructions: string
  cooking_time: number
  difficulty: string
  category: string
  description: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at'>
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>
      }
    }
  }
}

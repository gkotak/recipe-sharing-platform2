'use client'

import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { createClient } from '@/lib/supabase/client'

interface RecipeSearchProps {
  onSearch: (recipes: any[]) => void
  className?: string
}

export default function RecipeSearch({ onSearch, className = '' }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const searchRecipes = async () => {
      const supabase = createClient()
      
      if (!debouncedSearch.trim()) {
        // If search is empty, fetch all recipes
        const { data: allRecipes, error } = await supabase
          .from('recipes')
          .select(`
            *,
            profiles:user_id (
              full_name
            )
          `)
          .order('created_at', { ascending: false })

        if (!error && allRecipes) {
          onSearch(allRecipes)
        }
        return
      }

      // Search in title, description, and category
      const searchTerm = `%${debouncedSearch}%`
      const { data: recipes, error } = await supabase
        .from('recipes')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .filter('title', 'ilike', searchTerm)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Search error:', error)
        // Keep the current results if there's an error
        return
      }
      
      if (recipes) {
        onSearch(recipes)
      }
    }

    searchRecipes()
  }, [debouncedSearch, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search recipes..."
        className="pl-10"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
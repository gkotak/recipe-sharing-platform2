'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import RecipeGrid from '@/components/recipe-grid'
import { CATEGORY_GROUPS, type RecipeCategory } from '@/lib/constants/categories'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { createClient } from '@/lib/supabase/client'

type Recipe = import('@/lib/supabase/types').Database['public']['Tables']['recipes']['Row'] & {
  profiles: {
    full_name: string | null
  } | null
}

interface BrowseContentProps {
  categoryToRecipes: Record<RecipeCategory, Recipe[]>
}

export default function BrowseContent({ categoryToRecipes }: BrowseContentProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<Recipe[] | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!debouncedQuery.trim()) {
        setResults(null)
        return
      }

      const supabase = createClient()
      const searchTerm = `%${debouncedQuery}%`
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .ilike('title', searchTerm)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Search error:', error)
        return
      }
      setResults((data || []) as unknown as Recipe[])
    }
    run()
  }, [debouncedQuery])

  const isSearching = !!debouncedQuery.trim()

  return (
    <div className="space-y-10">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search recipes..."
          className="pl-10"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
      </div>

      {isSearching ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {results && results.length > 0 ? (
            <RecipeGrid recipes={results} />
          ) : (
            <p className="text-muted-foreground">No recipes found.</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORY_GROUPS.map(group => (
            <div key={group.label} className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">{group.label}</h2>
              <div className="space-y-10">
                {group.categories.map(cat => {
                  const recipes = categoryToRecipes[cat.value] || []
                  if (recipes.length === 0) return null
                  return (
                    <section key={cat.value} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{cat.label}</h3>
                      </div>
                      <RecipeGrid recipes={recipes} />
                    </section>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



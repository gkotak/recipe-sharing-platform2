import { createClient } from '@/lib/supabase/server'
import { CATEGORY_GROUPS, ALL_CATEGORIES, type RecipeCategory, getCategoryLabel } from '@/lib/constants/categories'
import BrowseContent from '@/components/browse-content'
import { RecipeWithProfile } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function BrowsePage() {
  const supabase = createClient()

  // Fetch latest recipes per category (limit per category)
  const limitPerCategory = 6

  // Use a plain object (with default prototype) to avoid serialization issues to Client Components
  const categoryToRecipes: Record<RecipeCategory, RecipeWithProfile[]> = {} as Record<RecipeCategory, RecipeWithProfile[]>

  for (const { value } of ALL_CATEGORIES) {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .eq('category', value)
      .order('created_at', { ascending: false })
      .limit(limitPerCategory)

    if (!error && data) {
      categoryToRecipes[value] = data as unknown as RecipeWithProfile[]
    } else {
      categoryToRecipes[value] = []
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Browse Recipes</h1>
        <p className="text-muted-foreground">Explore by category or search across all recipes.</p>
      </div>

      <BrowseContent categoryToRecipes={categoryToRecipes} />
    </div>
  )
}



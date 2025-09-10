import { Database } from '@/lib/supabase/types'
import RecipeCard from './recipe-card'

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  profiles: {
    full_name: string | null
  } | null
}

interface RecipeGridProps {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  console.log('RecipeGrid received recipes:', recipes) // Debug log

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  )
}
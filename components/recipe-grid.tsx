import RecipeCard from './recipe-card'
import { RecipeWithProfile } from '@/lib/types'

interface RecipeGridProps {
  recipes: RecipeWithProfile[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {

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
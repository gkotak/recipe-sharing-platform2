import Link from 'next/link'
import { Clock, ChefHat, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { RecipeWithProfile } from '@/lib/types'

interface RecipeCardProps {
  recipe: RecipeWithProfile
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const timeAgo = formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })
  const authorName = recipe.profiles?.full_name || 'Unknown'

  return (
    <Link 
      href={`/recipes/${recipe.id}`}
      className="block group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
    >
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            by {authorName} • {timeAgo}
          </p>
        </div>
        
        {recipe.description && (
          <p className="text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cooking_time} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className="capitalize">{recipe.category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
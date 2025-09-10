import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Clock, ChefHat, Utensils } from 'lucide-react'
import { searchRecipeImage } from '@/lib/unsplash'
import Image from 'next/image'

export default async function RecipeDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles:user_id (
        full_name
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !recipe) {
    console.error('Error fetching recipe:', error)
    notFound()
  }

  const timeAgo = formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })
  
  // Search for a relevant image based on recipe title and description
  const imageQuery = `${recipe.title} ${recipe.description || ''}`
  const imageUrl = await searchRecipeImage(imageQuery)

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <span>By {recipe.profiles?.full_name || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{timeAgo}</span>
          </div>
          {recipe.description && (
            <p className="text-lg text-muted-foreground">{recipe.description}</p>
          )}
        </div>

        {/* Recipe Image */}
        {imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden relative aspect-video">
            <Image
              src={imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Recipe Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
            <Clock className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Cooking Time</p>
              <p className="text-2xl font-bold">{recipe.cooking_time} mins</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
            <ChefHat className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Difficulty</p>
              <p className="text-2xl font-bold capitalize">{recipe.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
            <Utensils className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Category</p>
              <p className="text-2xl font-bold capitalize">{recipe.category}</p>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-lg">{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        {recipe.instructions && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {recipe.instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
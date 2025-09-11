import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Clock, ChefHat, Utensils } from 'lucide-react'
import { searchRecipeImage } from '@/lib/unsplash'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import DeleteRecipeButton from '@/components/delete-recipe-button'
import LikeButton from '@/components/like-button'
import CommentForm from '@/components/comment-form'
import { tryTableVariations, tryTableVariationsMutation } from '@/lib/utils/table-resolution'
import { getCurrentUser, requireAuth, AUTH_MESSAGES } from '@/lib/utils/auth-server'
import { handleSupabaseError } from '@/lib/utils/error-handling'

export const dynamic = 'force-dynamic'

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

  // Determine ownership
  const user = await getCurrentUser()
  const isOwner = !!user && user.id === recipe.user_id

  // Likes: count + whether current user liked
  let likeCount = 0
  let userLike: any = null
  
  const { data: likeData } = await tryTableVariations(
    supabase,
    'likes',
    async (tableName) => {
      const [{ count }, { data: like }] = await Promise.all([
        supabase
          .from(tableName as any)
          .select('*', { count: 'exact', head: true })
          .eq('recipe_id', recipe.id),
        user
          ? supabase
              .from(tableName as any)
              .select('recipe_id')
              .eq('recipe_id', recipe.id)
              .eq('user_id', user.id)
              .maybeSingle()
          : Promise.resolve({ data: null } as any)
      ])
      
      return { data: { count, like }, error: null }
    }
  )
  
  if (likeData && typeof likeData === 'object' && 'count' in likeData) {
    likeCount = (likeData as any).count || 0
    userLike = (likeData as any).like
  }

  const likedByUser = !!userLike

  // Fetch comments directly - RLS should allow public read access
  let comments: any[] = []
  
  const { data: commentsData } = await tryTableVariations(
    supabase,
    'comments',
    async (tableName) => {
      return await supabase
        .from(tableName as any)
        .select('id, content, created_at, user_id, recipe_id')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: false })
    }
  )
  
  if (commentsData) {
    comments = commentsData as any[]
  }

  // Fetch commenter names
  let userIdToName: Record<string, string> = {}
  if (comments.length > 0) {
    const userIds = Array.from(new Set(comments.map((c: any) => c.user_id).filter(Boolean)))
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds)
      
      if (profilesData) {
        userIdToName = Object.fromEntries(profilesData.map((p: any) => [p.id, p.full_name || 'Unknown']))
      }
    }
  }

  // Server action to delete a recipe (owner-only)
  async function deleteRecipe(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const actionUser = await requireAuth('You need to be logged in to delete recipes')
    const recipeId = formData.get('recipe_id')

    if (!recipeId) {
      throw new Error('Recipe ID is required')
    }

    const { error: deleteError } = await supabaseServer
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .eq('user_id', actionUser.id)

    if (deleteError) {
      throw new Error(handleSupabaseError(deleteError))
    }

    redirect('/dashboard')
  }

  // Server action to toggle like
  async function toggleLike(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const actionUser = await requireAuth(AUTH_MESSAGES.LIKE_REQUIRED)
    const recipeId = String(formData.get('recipe_id') || '')
    
    if (!recipeId) {
      throw new Error('Recipe ID is required')
    }

    // Check if like already exists
    const { data: existing } = await tryTableVariations(
      supabaseServer,
      'likes',
      async (tableName) => {
        return await supabaseServer
          .from(tableName as any)
          .select('recipe_id')
          .eq('recipe_id', recipeId)
          .eq('user_id', actionUser.id)
          .maybeSingle()
      }
    )

    if (existing) {
      // Unlike: delete the like
      await tryTableVariationsMutation(
        supabaseServer,
        'likes',
        async (tableName) => {
          return await supabaseServer
            .from(tableName as any)
            .delete()
            .eq('recipe_id', recipeId)
            .eq('user_id', actionUser.id)
        }
      )
    } else {
      // Like: insert the like
      await tryTableVariationsMutation(
        supabaseServer,
        'likes',
        async (tableName) => {
          return await supabaseServer
            .from(tableName as any)
            .insert({ recipe_id: recipeId, user_id: actionUser.id } as any)
        }
      )
    }

    // Revalidate the page to ensure the like count updates
    revalidatePath(`/recipes/${params.id}`)
  }

  // Server action: add comment
  async function addComment(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const actionUser = await requireAuth(AUTH_MESSAGES.LIKE_REQUIRED)
    const recipeId = String(formData.get('recipe_id') || '')
    const content = String(formData.get('content') || '').trim()
    
    if (!recipeId || !content) {
      throw new Error('Recipe ID and content are required')
    }
    
    const success = await tryTableVariationsMutation(
      supabaseServer,
      'comments',
      async (tableName) => {
        return await supabaseServer
          .from(tableName as any)
          .insert({ recipe_id: recipeId, user_id: actionUser.id, content } as any)
      }
    )

    if (!success) {
      throw new Error('Failed to insert comment')
    }

    revalidatePath(`/recipes/${params.id}`)
  }

  // Server action: delete own comment
  async function deleteComment(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const actionUser = await requireAuth('You need to be logged in to delete comments')
    const commentId = String(formData.get('comment_id') || '')
    
    if (!commentId) {
      throw new Error('Comment ID is required')
    }
    await tryTableVariationsMutation(
      supabaseServer,
      'comments',
      async (tableName) => {
        return await supabaseServer
          .from(tableName as any)
          .delete()
          .eq('id', commentId)
          .eq('user_id', actionUser.id)
      }
    )

    revalidatePath(`/recipes/${params.id}`)
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <span>By {recipe.profiles?.full_name || 'Unknown'}</span>
                <span className="mx-2">•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Link href={`/recipes/create?edit=${recipe.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <DeleteRecipeButton recipeId={recipe.id} action={deleteRecipe} />
              </div>
            )}
          </div>
          {recipe.description && (
            <p className="text-lg text-muted-foreground">{recipe.description}</p>
          )}
        </div>

        {/* Actions + Image */}
        <div className="mb-4 flex items-center justify-between">
          <LikeButton
            recipeId={String(recipe.id)}
            initialLiked={likedByUser}
            initialCount={likeCount ?? 0}
            action={toggleLike}
            isAuthenticated={!!user}
          />
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
            {recipe.ingredients.map((ingredient: string, index: number) => (
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

        {/* Comments */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <div className="mb-6">
            <CommentForm onSubmit={addComment} recipeId={String(recipe.id)} isAuthenticated={!!user} />
          </div>
          
          
          <div className="space-y-4">
            {comments?.length ? (
              comments.map((c: any) => (
                <div key={c.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span>{userIdToName[c.user_id] || 'Unknown'}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                    </div>
                    {user?.id === c.user_id && (
                      <form action={deleteComment}>
                        <input type="hidden" name="comment_id" value={c.id} />
                        <Button variant="outline" size="sm">Delete</Button>
                      </form>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
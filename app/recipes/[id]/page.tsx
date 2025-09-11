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
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = !!user && user.id === recipe.user_id

  // Likes: count + whether current user liked (try both table names)
  let likeCount = 0
  let userLike: any = null
  
  const likeTables = ['recipe_likes', 'likes']
  for (const tbl of likeTables) {
    const [{ count }, { data: like }] = await Promise.all([
      supabase
        .from(tbl as any)
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipe.id),
      user
        ? supabase
            .from(tbl as any)
            .select('recipe_id')
            .eq('recipe_id', recipe.id)
            .eq('user_id', user.id)
            .maybeSingle()
        : Promise.resolve({ data: null } as any)
    ])
    
    if (count !== null) {
      likeCount = count
      userLike = like
      break
    }
  }

  const likedByUser = !!userLike

  // Fetch comments for this recipe (newest-first), tolerant to table name variations
  let comments: any[] = []
  let commentsTableUsed: string | null = null
  {
    const tryTables = ['comments', 'recipe_comments']
    for (const tbl of tryTables) {
      const { data, error } = await supabase
        .from(tbl as any)
        .select('id, content, created_at, user_id, recipe_id')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: false })
      if (!error && data) {
        comments = data as any[]
        commentsTableUsed = tbl
        break
      }
    }
  }

  // Best-effort fetch of commenter names without relying on FK embed
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
    const { data: { user: actionUser } } = await supabaseServer.auth.getUser()
    const recipeId = formData.get('recipe_id')

    if (!actionUser || !recipeId) {
      redirect(`/recipes/${params.id}`)
    }

    const { error: deleteError } = await supabaseServer
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .eq('user_id', actionUser.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      redirect(`/recipes/${params.id}?error=cannot_delete`)
    }

    redirect('/dashboard')
  }

  // Server action to toggle like
  async function toggleLike(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const { data: { user: actionUser } } = await supabaseServer.auth.getUser()
    const recipeId = String(formData.get('recipe_id') || '')
    if (!actionUser || !recipeId) {
      return
    }

    // Try both possible table names for likes
    const tables = ['recipe_likes', 'likes']
    for (const tbl of tables) {
      const { data: existing } = await supabaseServer
        .from(tbl as any)
        .select('recipe_id')
        .eq('recipe_id', recipeId)
        .eq('user_id', actionUser.id)
        .maybeSingle()

      if (existing) {
        await supabaseServer
          .from(tbl as any)
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', actionUser.id)
      } else {
        await supabaseServer
          .from(tbl as any)
          .insert({ recipe_id: recipeId, user_id: actionUser.id } as any)
      }
      // If we get here without error, we found the right table
      break
    }

    // Revalidate the page to ensure the like count updates
    revalidatePath(`/recipes/${params.id}`)
  }

  // Server action: add comment
  async function addComment(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const { data: { user: actionUser } } = await supabaseServer.auth.getUser()
    const recipeId = String(formData.get('recipe_id') || '')
    const content = String(formData.get('content') || '').trim()
    if (!actionUser || !recipeId || !content) return
    // Try common table names
    const tables = ['comments', 'recipe_comments']
    let inserted = false
    for (const tbl of tables) {
      const { error } = await supabaseServer
        .from(tbl as any)
        .insert({ recipe_id: recipeId, user_id: actionUser.id, content } as any)
      if (!error) { inserted = true; break }
    }
    revalidatePath(`/recipes/${params.id}`)
  }

  // Server action: delete own comment
  async function deleteComment(formData: FormData) {
    'use server'
    const supabaseServer = createClient()
    const { data: { user: actionUser } } = await supabaseServer.auth.getUser()
    const commentId = String(formData.get('comment_id') || '')
    if (!actionUser || !commentId) return
    // Try common table names
    const tables = ['comments', 'recipe_comments']
    for (const tbl of tables) {
      const { error } = await supabaseServer
        .from(tbl as any)
        .delete()
        .eq('id', commentId)
        .eq('user_id', actionUser.id)
      if (!error) break
    }
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
          {user && (
            <div className="mb-6">
              <CommentForm onSubmit={addComment} recipeId={String(recipe.id)} />
            </div>
          )}
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
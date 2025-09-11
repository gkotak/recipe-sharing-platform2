import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeGrid from '@/components/recipe-grid'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Suspense } from 'react'
import { RecipeGridSkeleton } from '@/components/skeletons/recipe-grid-skeleton'

export default async function DashboardPage() {
  const supabase = createClient()

  try {
    // Check authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Auth error:', authError)
      redirect('/')
    }

    if (!session) {
      redirect('/')
    }

    const userId = session.user.id

    // 1) User's own recipes
    const { data: ownRecipes, error: ownErr } = await supabase
      .from('recipes')
      .select('id')
      .eq('user_id', userId)

    if (ownErr) throw new Error(`Own recipes error: ${ownErr.message}`)

    // 2) Recipes the user liked (if likes table exists)
    const { data: likedRows, error: likesErr } = await supabase
      .from('likes')
      .select('recipe_id')
      .eq('user_id', userId)

    if (likesErr && likesErr.code !== '42P01') {
      // 42P01: relation does not exist. Ignore if table missing.
      throw new Error(`Likes fetch error: ${likesErr.message}`)
    }

    // 3) Recipes the user commented on (if comments table exists)
    const { data: commentRows, error: commentsErr } = await supabase
      .from('comments')
      .select('recipe_id')
      .eq('user_id', userId)

    if (commentsErr && commentsErr.code !== '42P01') {
      throw new Error(`Comments fetch error: ${commentsErr.message}`)
    }

    const ownIds = (ownRecipes || []).map(r => r.id)
    const likedIds = (likedRows || []).map(r => (r as any).recipe_id as string)
    const commentedIds = (commentRows || []).map(r => (r as any).recipe_id as string)

    const uniqueRecipeIds = Array.from(new Set([...ownIds, ...likedIds, ...commentedIds]))

    let recipes: any[] = []
    if (uniqueRecipeIds.length > 0) {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .in('id', uniqueRecipeIds)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Recipe fetch error: ${error.message}${error.details ? ` - ${error.details}` : ''}`)
      }
      recipes = data || []
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-muted-foreground mt-2">Recipes you've added, liked, or commented on</p>
          </div>
          <Button asChild>
            <Link href="/recipes/create" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Recipe
            </Link>
          </Button>
        </div>

        <Suspense fallback={<RecipeGridSkeleton />}>
          {!recipes || recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No matching recipes yet.</p>
              <Button asChild className="mt-4">
                <Link href="/recipes/create">Share Your First Recipe</Link>
              </Button>
            </div>
          ) : (
            <RecipeGrid recipes={recipes} />
          )}
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    // For any error, redirect to home page
    redirect('/')
  }
}
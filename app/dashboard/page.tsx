import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeGrid from '@/components/recipe-grid'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default async function DashboardPage() {
  // First verify our environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-500 font-medium">Configuration Error</p>
          <p className="text-sm text-red-400 mt-2">
            Missing Supabase configuration. Please check your environment variables.
          </p>
        </div>
      </div>
    )
  }

  try {
    const supabase = createClient()

    // Check authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Auth error:', authError)
      redirect('/')
    }

    if (!session) {
      redirect('/')
    }

    // Fetch recipes with error handling
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .order('created_at', { ascending: false })

    if (recipesError) {
      throw new Error(`Recipe fetch error: ${recipesError.message}${recipesError.details ? ` - ${recipesError.details}` : ''}`)
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Latest Recipes</h1>
            <p className="text-muted-foreground mt-2">
              Discover delicious recipes shared by our community
            </p>
          </div>
          <Button asChild>
            <Link href="/recipes/create" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Recipe
            </Link>
          </Button>
        </div>

        {!recipes || recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No recipes have been shared yet.</p>
            <Button asChild className="mt-4">
              <Link href="/recipes/create">Share Your First Recipe</Link>
            </Button>
          </div>
        ) : (
          <RecipeGrid recipes={recipes} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })

    // For any error, redirect to home page
    redirect('/')
  }
}
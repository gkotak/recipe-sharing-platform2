import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeForm from '@/components/recipe-form'

export default async function CreateRecipePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
        <RecipeForm />
      </div>
    </div>
  )
}

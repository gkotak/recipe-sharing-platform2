import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeForm from '@/components/recipe-form'

export default async function CreateRecipePage({
  searchParams
}: {
  searchParams: { edit?: string }
}) {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/')
  }

  // If editing, fetch the recipe to prefill
  let recipeToEdit: any = null
  if (searchParams?.edit) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', searchParams.edit)
      .single()

    if (!error) {
      recipeToEdit = data
    }
  }

  const isEdit = !!recipeToEdit

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h1>
        <RecipeForm initialData={recipeToEdit} recipeId={recipeToEdit?.id} />
      </div>
    </div>
  )
}

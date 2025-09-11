'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type DeleteRecipeButtonProps = {
  recipeId: string | number
  action: (formData: FormData) => Promise<void>
}

export default function DeleteRecipeButton({ recipeId, action }: DeleteRecipeButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        Delete
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold">Delete recipe?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the recipe from the database.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <form
                action={async (fd: FormData) => {
                  await action(fd)
                }}
              >
                <input type="hidden" name="recipe_id" value={String(recipeId)} />
                <Button type="submit" variant="destructive">
                  Confirm Delete
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}




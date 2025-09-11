'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'

type CommentFormProps = {
  onSubmit: (formData: FormData) => Promise<void>
  recipeId: string
  isAuthenticated: boolean
}

export default function CommentForm({ onSubmit, recipeId, isAuthenticated }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={onSubmit}
      className="space-y-2"
    >
      <input type="hidden" name="recipe_id" value={recipeId} />
      <input type="hidden" name="content" value={content} />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || !content.trim()}
          onClick={() => {
            console.log('CommentForm clicked, isAuthenticated:', isAuthenticated, 'content:', content)
            if (isAuthenticated && content.trim()) {
              setContent('')
            }
          }}
        >
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}




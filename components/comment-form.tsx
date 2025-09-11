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
      action={async (fd: FormData) => {
        console.log('CommentForm submitted, isAuthenticated:', isAuthenticated, 'content:', content)
        if (!content.trim()) return
        // Always call the server action - it will handle redirect for unauthenticated users
        fd.set('recipe_id', recipeId)
        fd.set('content', content)
        await onSubmit(fd)
        if (isAuthenticated) {
          setContent('')
        }
      }}
      className="space-y-2"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}




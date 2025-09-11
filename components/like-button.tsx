'use client'

import { useOptimistic, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

type LikeButtonProps = {
  recipeId: string
  initialLiked: boolean
  initialCount: number
  action: (formData: FormData) => Promise<void>
}

export default function LikeButton({ recipeId, initialLiked, initialCount, action }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useOptimistic({ liked: initialLiked, count: initialCount }, (prev) => prev)

  return (
    <form
      action={(fd: FormData) => {
        // optimistic update
        setState({ liked: !state.liked, count: state.liked ? state.count - 1 : state.count + 1 })
        startTransition(async () => {
          await action(fd)
        })
      }}
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="recipe_id" value={recipeId} />
      <input type="hidden" name="liked" value={String(state.liked)} />
      <Button type="submit" variant={state.liked ? 'default' : 'outline'} disabled={isPending} className="gap-2">
        <Heart className={`h-4 w-4 ${state.liked ? 'fill-current' : ''}`} />
        {state.count}
      </Button>
    </form>
  )
}




import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RecipeNotFound() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/recipes">Browse All Recipes</Link>
        </Button>
      </div>
    </div>
  )
}

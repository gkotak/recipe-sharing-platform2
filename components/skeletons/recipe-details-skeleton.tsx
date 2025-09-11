import { Skeleton } from "@/components/ui/skeleton"

export function RecipeDetailsSkeleton() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>

        {/* Recipe Image */}
        <div className="mb-8 rounded-lg overflow-hidden relative aspect-video">
          <Skeleton className="absolute inset-0" />
        </div>

        {/* Recipe Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-4 rounded-lg bg-muted">
              <Skeleton className="h-5 w-5" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <Skeleton className="h-8 w-40 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-2/3" />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <Skeleton className="h-8 w-40 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


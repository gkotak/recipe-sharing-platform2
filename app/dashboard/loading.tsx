import { RecipeGridSkeleton } from "@/components/skeletons/recipe-grid-skeleton"

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Latest Recipes</h1>
          <p className="text-muted-foreground mt-2">
            Discover delicious recipes shared by our community
          </p>
        </div>
      </div>
      <RecipeGridSkeleton />
    </div>
  )
}


import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { RecipeGrid } from "@/components/recipe-grid"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Discover & Share Delicious Recipes
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join our community of food lovers. Find inspiration for your next meal or share your favorite recipes with the world.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <input
                  className="w-full bg-white shadow-sm transition-colors border border-input rounded-md px-8 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
                  placeholder="Search recipes..."
                  type="search"
                />
              </div>
              <Button className="w-full" size="sm">
                Search Recipes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Breakfast", "Lunch", "Dinner", "Desserts"].map((category) => (
              <div
                key={category}
                className="group relative aspect-square overflow-hidden rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-lg font-medium text-white">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Latest Recipes</h2>
            <Button variant="outline">View All</Button>
          </div>
          <RecipeGrid />
        </div>
      </section>
    </div>
  )
}
"use client"

import { useState } from "react"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeFilters } from "@/components/recipe-filters"

// Mock data for development
const MOCK_RECIPES = [
  {
    title: "Classic Spaghetti Carbonara",
    description: "A creamy Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
    cookingTime: 30,
    servings: 4,
    likes: 128,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1200",
    slug: "classic-spaghetti-carbonara",
    rating: 4.8,
    createdAt: "2024-02-26T10:00:00Z"
  },
  {
    title: "Homemade Margherita Pizza",
    description: "Traditional Neapolitan pizza with fresh mozzarella, tomatoes, and basil.",
    cookingTime: 45,
    servings: 2,
    likes: 95,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1200",
    slug: "homemade-margherita-pizza",
    rating: 4.5,
    createdAt: "2024-02-25T15:30:00Z"
  },
  {
    title: "Avocado Toast",
    description: "Crusty sourdough bread topped with mashed avocado, eggs, and chili flakes.",
    cookingTime: 15,
    servings: 1,
    likes: 76,
    image: "https://images.unsplash.com/photo-1603046891744-1f76eb10aec3?q=80&w=1200",
    slug: "avocado-toast",
    rating: 4.2,
    createdAt: "2024-02-24T08:15:00Z"
  },
  {
    title: "Chocolate Chip Cookies",
    description: "Soft and chewy cookies loaded with chocolate chips.",
    cookingTime: 25,
    servings: 24,
    likes: 156,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee9ed6271?q=80&w=1200",
    slug: "chocolate-chip-cookies",
    rating: 4.9,
    createdAt: "2024-02-23T14:45:00Z"
  }
]

export function RecipeGrid() {
  const [activeFilter, setActiveFilter] = useState<"latest" | "trending" | "top-rated">("latest")

  const filteredRecipes = [...MOCK_RECIPES].sort((a, b) => {
    switch (activeFilter) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "trending":
        return b.likes - a.likes
      case "top-rated":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div>
      <RecipeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.slug} {...recipe} />
        ))}
      </div>
    </div>
  )
}

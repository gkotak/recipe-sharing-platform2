"use client"

import { Button } from "@/components/ui/button"
import { Clock, Flame, Star } from "lucide-react"

interface RecipeFiltersProps {
  activeFilter: "latest" | "trending" | "top-rated"
  onFilterChange: (filter: "latest" | "trending" | "top-rated") => void
}

export function RecipeFilters({ activeFilter, onFilterChange }: RecipeFiltersProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={activeFilter === "latest" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("latest")}
        className="flex items-center gap-2"
      >
        <Clock className="h-4 w-4" />
        Latest
      </Button>
      <Button
        variant={activeFilter === "trending" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("trending")}
        className="flex items-center gap-2"
      >
        <Flame className="h-4 w-4" />
        Trending
      </Button>
      <Button
        variant={activeFilter === "top-rated" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("top-rated")}
        className="flex items-center gap-2"
      >
        <Star className="h-4 w-4" />
        Top Rated
      </Button>
    </div>
  )
}

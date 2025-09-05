"use client"

import { Heart, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RecipeCardProps {
  title: string
  description: string
  cookingTime: number
  servings: number
  likes: number
  image: string
  slug: string
}

export function RecipeCard({
  title,
  description,
  cookingTime,
  servings,
  likes,
  image,
  slug,
}: RecipeCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg">
      <Link href={`/recipes/${slug}`}>
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {description}
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{servings} servings</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute right-4 top-4">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/50 backdrop-blur-sm hover:bg-white/75 dark:bg-gray-950/50 dark:hover:bg-gray-950/75"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Like</span>
        </Button>
      </div>
    </div>
  )
}

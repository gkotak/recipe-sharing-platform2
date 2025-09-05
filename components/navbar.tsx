"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/" className="text-2xl font-bold">
            RecipeShare
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/recipes" className="text-sm font-medium transition-colors hover:text-primary">
              Browse
            </Link>
            <Link href="/tags" className="text-sm font-medium transition-colors hover:text-primary">
              Tags
            </Link>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <Button variant="default" asChild>
            <Link href="/create">Share Recipe</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

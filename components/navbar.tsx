'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, User } from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { supabase, session } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/" className="text-2xl font-bold">
            RecipeShare
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/browse" className="text-sm font-medium transition-colors hover:text-primary">
              Browse
            </Link>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <ModeToggle />
          {session ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Link 
                href="/profile" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {session.user.user_metadata.first_name}
              </Link>
              <Button variant="default" asChild>
                <Link href="/dashboard">My Recipes</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="default" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
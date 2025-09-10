import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main>
      <section className="relative">
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Share Your Culinary Creations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of food enthusiasts. Share your favorite recipes,
            discover new dishes, and connect with fellow home chefs.
          </p>
          {session ? (
            <Button asChild size="lg">
              <Link href="/create">Share a Recipe</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/auth/sign-in">Get Started</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Share Your Recipes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Inspire Others</h3>
              <p className="text-muted-foreground">
                Share your unique recipes and cooking techniques with a community of
                food lovers.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Get Feedback</h3>
              <p className="text-muted-foreground">
                Receive comments and suggestions from other cooks to improve your
                recipes.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Build Your Collection</h3>
              <p className="text-muted-foreground">
                Save and organize your favorite recipes in one place, accessible
                anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
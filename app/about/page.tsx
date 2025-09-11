import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Linkedin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Recipse Share</h1>
        
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-lg leading-relaxed mb-6">
            Recipse Share was founded by Gaurav Kotak, a visionary entrepreneur dedicated to bringing people together through 
            the joy of cooking and sharing recipes. With a passion for culinary arts and community building, Gaurav envisioned 
            a platform where individuals from diverse backgrounds could connect, share, and discover new recipes, fostering a 
            global community of food enthusiasts.
          </p>

          <p className="text-lg leading-relaxed mb-8">
            Under Gaurav&apos;s leadership, Recipse Share has grown into a vibrant and inclusive space, offering a vast collection 
            of user-generated recipes, cooking tips, and interactive features that encourage collaboration and creativity in 
            the kitchen. His commitment to innovation and user engagement continues to drive the platform&apos;s success, making 
            it a go-to destination for anyone looking to explore and share the world of cooking.
          </p>

          <div className="bg-card rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To create a global community where food enthusiasts can share their culinary creativity, discover new recipes, 
              and connect with fellow cooking lovers. We believe that every recipe tells a story, and every shared meal 
              brings people closer together.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button asChild variant="outline" size="lg">
              <Link 
                href="https://www.linkedin.com/in/gkotak/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link 
                href="https://github.com/gauravkotak" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                Follow on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


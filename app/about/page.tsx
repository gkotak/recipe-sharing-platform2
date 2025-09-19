import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Linkedin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">About Recipe Share</h1>
        
        <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
          <p className="text-xl leading-relaxed mb-8 text-center">
            Recipe Share was founded by three passionate individuals with complementary expertise in technology, strategic innovation, and user experience design.
            Together, they created a vibrant platform where individuals from diverse backgrounds can connect, share, and discover new recipes,
            fostering a global community of food enthusiasts while ensuring sustainable growth and inclusive community building.
          </p>
        </div>

        {/* Founders Section */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Gaurav Kotak */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 border-4 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center h-full text-6xl text-orange-500 dark:text-orange-400">
                👨‍💼
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Gaurav Kotak</h3>
            <p className="text-lg text-muted-foreground mb-4">Co-Founder & Technical Lead</p>
            <p className="text-sm leading-relaxed mb-6">
              A visionary entrepreneur with a passion for culinary arts and community building. Gaurav brings 
              his technical expertise and innovation-driven approach to create engaging user experiences that 
              encourage collaboration and creativity in the kitchen.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link 
                  href="https://www.linkedin.com/in/gkotak/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link 
                  href="https://github.com/gauravkotak" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>

          {/* Sarah George Kotak */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-rose-200 dark:border-rose-800">
              <Image
                src="/sarah_image.jpeg"
                alt="Sarah George Kotak"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sarah George Kotak</h3>
            <p className="text-lg text-muted-foreground mb-4">Co-Founder & Strategic Advisor</p>
            <p className="text-sm leading-relaxed mb-6">
              A Financial Services lawyer who traded derivatives documentation for recipe experimentation.
              Sarah brings the same precision she uses for complex financial instruments to measuring spices—though
              she's learned that unlike contracts, a pinch of this and a dash of that actually works in cooking!
              Her passion for diversity extends from boardrooms to kitchens, ensuring Recipe Share welcomes every
              flavor and cooking style, from molecular gastronomy to grandma's secret recipes.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link 
                  href="https://uk.linkedin.com/in/sarah-george-kotak-b765b4a" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
            </div>
          </div>

          {/* Chrystian */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 border-4 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center h-full text-6xl text-blue-500 dark:text-blue-400">
                👨‍💻
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Chrystian</h3>
            <p className="text-lg text-muted-foreground mb-4">Co-Founder & Product Design Lead</p>
            <p className="text-sm leading-relaxed mb-6">
              A Senior Product Designer who believes the perfect user interface is like a well-plated dish—beautiful,
              intuitive, and leaves you wanting more. Chrystian applies his UX wizardry to ensure Recipe Share is as
              smooth as a perfectly whisked hollandaise. When he's not conducting usability tests, he's probably testing
              recipes (for research purposes, of course). His Scrum certification means he can sprint through both
              product roadmaps and grocery store aisles with equal efficiency.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link
                  href="https://www.linkedin.com/in/chrystian-klingenberg-a4674a137/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-card rounded-lg p-8 shadow-lg mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">Our Mission</h2>
          <p className="text-muted-foreground text-center">
            To create a global community where food enthusiasts can share their culinary creativity, discover new recipes, 
            and connect with fellow cooking lovers. We believe that every recipe tells a story, and every shared meal 
            brings people closer together.
          </p>
        </div>
      </div>
    </div>
  )
}


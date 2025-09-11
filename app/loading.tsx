import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
}
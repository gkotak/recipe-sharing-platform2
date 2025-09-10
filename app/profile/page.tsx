import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/profile-form'

export default async function ProfilePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const { data: { session }, error: authError } = await supabase.auth.getSession()
  if (!session || authError) {
    redirect('/')
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  )
}

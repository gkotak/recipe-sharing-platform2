import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient()

    // Exchange the code for a session
    const { data: { user }, error: signInError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (signInError) {
      console.error('Sign in error:', signInError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=Could not sign in user`)
    }

    if (!user) {
      console.error('No user found after sign in')
      return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=No user found`)
    }

    try {
      // Create or update the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: user.email,
          full_name: user.user_metadata.full_name || user.user_metadata.display_name || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // Continue anyway as this is not critical for the user
      }
    } catch (error) {
      console.error('Profile update error:', error)
      // Continue anyway as this is not critical for the user
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin)
  }

  // If no code is present, redirect to sign-in page
  return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in?error=No code provided`)
}
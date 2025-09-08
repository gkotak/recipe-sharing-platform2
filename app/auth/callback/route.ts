import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user?.user_metadata?.first_name) {
      // Update the user's profile with their first name
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.user_metadata.first_name,
        updated_at: new Date().toISOString(),
      })
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}

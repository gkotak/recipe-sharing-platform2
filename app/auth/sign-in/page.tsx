import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/auth/auth-form'

export default async function SignInPage() {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-muted-foreground text-center mt-2">
          Sign in to your account to continue
        </p>
        <AuthForm />
      </div>
    </div>
  )
}
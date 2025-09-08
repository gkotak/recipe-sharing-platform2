import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import AuthForm from '@/components/auth/auth-form'

export default async function SignIn() {
  const supabase = createServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email to receive a magic link
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

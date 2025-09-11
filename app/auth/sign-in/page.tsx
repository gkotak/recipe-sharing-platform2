import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/auth/auth-form'

export const dynamic = 'force-dynamic'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
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
        {searchParams.message && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-300">
              {searchParams.message}
            </p>
          </div>
        )}
        <AuthForm />
      </div>
    </div>
  )
}
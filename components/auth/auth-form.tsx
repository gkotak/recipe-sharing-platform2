'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

type AuthMode = 'sign-in' | 'sign-up'
type AuthMethod = 'magic-link' | 'password'

function validatePassword(password: string) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const missing = []
  if (!hasUpperCase) missing.push("uppercase letter")
  if (!hasNumber) missing.push("number")
  if (!hasSpecialChar) missing.push("special character")
  
  if (missing.length > 0) {
    throw new Error(
      `Password must contain at least one ${missing.join(", one ")}.`
    )
  }
}

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [method, setMethod] = useState<AuthMethod>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { supabase } = useSupabase()
  const router = useRouter()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (method === 'magic-link') {
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: fullName },
          },
        })
        if (signInError) throw signInError
        setSuccess(true)
      } else {
        if (mode === 'sign-up') {
          try {
            validatePassword(password)
          } catch (validationError) {
            throw validationError
          }
          
          console.log('Attempting sign up with:', { email, fullName })
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: { full_name: fullName },
            },
          })
          
          console.log('Sign up response:', {
            user: data.user,
            session: data.session,
            error: signUpError
          })
          
          if (signUpError) throw signUpError
          
          if (!data.user) {
            throw new Error('Failed to create user account')
          }
          
          setSuccess(true)
        } else {
          const { error: signInError, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (signInError) throw signInError
          
          if (!data.user?.email_confirmed_at) {
            throw new Error('Please verify your email before signing in.')
          }
          
          router.push('/dashboard')
        }
      }

      if (success) {
        setEmail('')
        setPassword('')
        setFullName('')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 text-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          {mode === 'sign-up' ? 'Verify your email' : 'Check your email'}
        </h3>
        <p className="text-sm text-green-600 dark:text-green-300">
          {mode === 'sign-up'
            ? "We've sent you an email with a verification link. Please verify your email to activate your account."
            : method === 'magic-link'
            ? "We've sent a magic link to your email address. Click the link to sign in to your account."
            : "Please check your email to verify your account before signing in."}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          type="button"
          variant={mode === 'sign-in' ? 'default' : 'outline'}
          onClick={() => setMode('sign-in')}
        >
          Sign In
        </Button>
        <Button
          type="button"
          variant={mode === 'sign-up' ? 'default' : 'outline'}
          onClick={() => setMode('sign-up')}
        >
          Sign Up
        </Button>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        {mode === 'sign-up' && (
          <div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
            />
          </div>
        )}
        
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
          />
        </div>

        <div className="space-y-1">
          <input
            type="password"
            required={method === 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
          />
          {mode === 'sign-up' && method === 'password' && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? 'Please wait...'
              : mode === 'sign-up'
              ? 'Create Account'
              : 'Sign In'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setMethod(method === 'magic-link' ? 'password' : 'magic-link')}
          >
            {method === 'magic-link' ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Password
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" /> Magic Link
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
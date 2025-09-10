'use client'

import { CheckCircle2 } from 'lucide-react'

interface SuccessMessageProps {
  mode: 'sign-in' | 'sign-up'
  method: 'magic-link' | 'password'
}

export function SuccessMessage({ mode, method }: SuccessMessageProps) {
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

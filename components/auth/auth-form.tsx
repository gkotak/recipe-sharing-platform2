'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/supabase-provider';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Mail, Lock, AlertCircle } from 'lucide-react';

type AuthMode = 'sign-in' | 'sign-up';
type AuthMethod = 'magic-link' | 'password';

function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [method, setMethod] = useState<AuthMethod>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const missing = [];
    if (!hasUpperCase) missing.push("uppercase letter");
    if (!hasNumber) missing.push("number");
    if (!hasSpecialChar) missing.push("special character");
    
    if (missing.length > 0) {
      throw new Error(
        `Password must contain at least one ${missing.join(", one ")}.`
      );
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (method === 'magic-link') {
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { first_name: firstName },
          },
        });
        if (signInError) throw signInError;
        setSuccess(true);
      } else {
        if (mode === 'sign-up') {
          try {
            validatePassword(password);
          } catch (validationError) {
            throw validationError;
          }
          
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: { first_name: firstName },
            },
          });
          if (signUpError) throw signUpError;
          setSuccess(true);
        } else {
          const { error: signInError, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) throw signInError;
          
          if (!data.user?.email_confirmed_at) {
            throw new Error('Please verify your email before signing in.');
          }
          
          router.refresh();
        }
      }

      if (success) {
        setEmail('');
        setPassword('');
        setFirstName('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return React.createElement('div', {
      className: "mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 text-center space-y-2"
    }, [
      React.createElement(CheckCircle2, {
        key: "icon",
        className: "h-12 w-12 text-green-500 mx-auto"
      }),
      React.createElement('h3', {
        key: "title",
        className: "text-lg font-semibold text-green-800 dark:text-green-200"
      }, mode === 'sign-up' ? 'Verify your email' : 'Check your email'),
      React.createElement('p', {
        key: "message",
        className: "text-sm text-green-600 dark:text-green-300"
      }, mode === 'sign-up'
        ? "We've sent you an email with a verification link. Please verify your email to activate your account."
        : method === 'magic-link'
        ? "We've sent a magic link to your email address. Click the link to sign in to your account."
        : "Please check your email to verify your account before signing in.")
    ]);
  }

  return React.createElement('div', {
    className: "mt-8 space-y-6"
  }, [
    React.createElement('div', {
      key: "buttons",
      className: "flex justify-center space-x-4 mb-8"
    }, [
      React.createElement(Button, {
        key: "signin",
        type: "button",
        variant: mode === 'sign-in' ? 'default' : 'outline',
        onClick: () => setMode('sign-in'),
        children: "Sign In"
      }),
      React.createElement(Button, {
        key: "signup",
        type: "button",
        variant: mode === 'sign-up' ? 'default' : 'outline',
        onClick: () => setMode('sign-up'),
        children: "Sign Up"
      })
    ]),
    React.createElement('form', {
      key: "form",
      onSubmit: handleAuth,
      className: "space-y-6"
    }, [
      mode === 'sign-up' && React.createElement('div', {
        key: "firstName",
        children: React.createElement('input', {
          type: "text",
          required: true,
          value: firstName,
          onChange: (e) => setFirstName(e.target.value),
          placeholder: "Enter your first name",
          className: "relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
        })
      }),
      React.createElement('div', {
        key: "email",
        children: React.createElement('input', {
          type: "email",
          required: true,
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "Enter your email",
          className: "relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
        })
      }),
      React.createElement('div', {
        key: "password",
        className: "space-y-1",
        children: [
          React.createElement('input', {
            key: "input",
            type: "password",
            required: method === 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Enter your password",
            className: "relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary bg-transparent"
          }),
          mode === 'sign-up' && method === 'password' && React.createElement('div', {
            key: "requirements",
            className: "flex items-start gap-1.5 text-xs text-muted-foreground",
            children: [
              React.createElement(AlertCircle, {
                key: "icon",
                className: "h-4 w-4 flex-shrink-0 mt-0.5"
              }),
              React.createElement('p', {
                key: "text",
                children: "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>)"
              })
            ]
          })
        ]
      }),
      error && React.createElement('p', {
        key: "error",
        className: "text-red-500 text-sm",
        children: error
      }),
      React.createElement('div', {
        key: "actions",
        className: "space-y-3",
        children: [
          React.createElement(Button, {
            key: "submit",
            type: "submit",
            disabled: loading,
            className: "w-full",
            children: loading
              ? 'Please wait...'
              : mode === 'sign-up'
              ? 'Create Account'
              : 'Sign In'
          }),
          React.createElement('div', {
            key: "divider",
            className: "relative",
            children: [
              React.createElement('div', {
                key: "line",
                className: "absolute inset-0 flex items-center",
                children: React.createElement('span', {
                  className: "w-full border-t"
                })
              }),
              React.createElement('div', {
                key: "text",
                className: "relative flex justify-center text-xs uppercase",
                children: React.createElement('span', {
                  className: "bg-background px-2 text-muted-foreground",
                  children: "Or continue with"
                })
              })
            ]
          }),
          React.createElement(Button, {
            key: "toggle",
            type: "button",
            variant: "outline",
            className: "w-full",
            onClick: () => setMethod(method === 'magic-link' ? 'password' : 'magic-link'),
            children: method === 'magic-link'
              ? [React.createElement(Lock, { key: "icon", className: "mr-2 h-4 w-4" }), "Password"]
              : [React.createElement(Mail, { key: "icon", className: "mr-2 h-4 w-4" }), "Magic Link"]
          })
        ]
      })
    ])
  ]);
}

export default AuthForm;
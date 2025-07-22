import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
      status: 400,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
      status: error.status || 400,
    }
  }

  // Redirect to the callback URL after successful sign up
  redirect('/auth/callback')
}

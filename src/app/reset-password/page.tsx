import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ResetPasswordClient from '@/app/reset-password/reset-password-client'

export default async function ResetPassword() {
  // Check if user is already authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If user is logged in, redirect them to profile page
  if (user) {
    redirect('/profile')
  }

  return <ResetPasswordClient />
}

import { createSafeClient } from '@/utils/supabase/safe-client'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'

export default async function ProtectedPage() {
  const safeClient = createSafeClient()

  // Get the current user safely
  const {
    data: user,
    error: authError,
    isPaused,
    isAvailable,
  } = await safeClient.getUser()

  if (!isAvailable) {
    if (isPaused) {
      return redirect('/sign-in?error=supabase_paused')
    }
    console.error('Error getting user:', authError)
    return redirect('/sign-in?error=not_authenticated')
  }

  if (authError || !user) {
    console.error('Error getting user:', authError)
    return redirect('/sign-in?error=not_authenticated')
  }

  // Get the full user data from the database safely
  const { data: userData, error: userError } = await safeClient.getUsers(
    user.email
  )

  if (userError) {
    console.error('Error fetching user data:', userError)
    return redirect('/sign-in?error=user_not_found')
  }

  // Handle sign out
  const signOut = async () => {
    'use server'
    const safeClient = createSafeClient()
    await safeClient.signOut()
    return redirect('/sign-in')
  }

  // Ensure the user object has the required structure for the client component
  const clientUser = {
    email: user.email || '',
    app_metadata: user.app_metadata || {},
  }

  return (
    <ProfileClient
      user={clientUser}
      userData={userData}
      signOutAction={signOut}
    />
  )
}

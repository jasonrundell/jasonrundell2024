import { createSafeClient } from '@/utils/supabase/safe-client'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'

export default async function ProtectedPage() {
  const safeClient = createSafeClient()

  // Get the current user safely
  const {
    data: userResult,
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

  if (authError || !userResult || !userResult.user) {
    console.error('Error getting user:', authError)
    return redirect('/sign-in?error=not_authenticated')
  }

  const user = userResult.user

  // Get the full user data from the database safely
  const { data: userDataArray, error: userError } = await safeClient.getUsers(
    user.email
  )

  if (userError) {
    console.error('Error fetching user data:', userError)
    return redirect('/sign-in?error=user_not_found')
  }

  // Extract the user data from the array
  const userData =
    userDataArray && userDataArray.length > 0
      ? {
          full_name: userDataArray[0].full_name,
          created_at: userDataArray[0].created_at,
        }
      : undefined

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

import { createSafeClient } from '@/utils/supabase/safe-client'
import { redirect } from 'next/navigation'
import ProfileClient from '@/app/profile/profile-client'
import { AuthLayout } from '@/components/auth/auth-layout'
import { generateInitialProfileSlug } from '@/lib/profile-slug'

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

  // console.log('[DEBUG] Profile page debug:', {
  //   userEmail: user.email,
  //   userDataArray,
  //   userError,
  //   userDataArrayLength: userDataArray?.length,
  // })

  if (userError) {
    console.error('Error fetching user data:', userError)
    return redirect('/sign-in?error=user_not_found')
  }

  // Extract the user data from the array
  let userData =
    userDataArray && userDataArray.length > 0
      ? {
          full_name: userDataArray[0].full_name,
          created_at: userDataArray[0].created_at,
          profile_slug: userDataArray[0].profile_slug as string | undefined,
          profile_slug_changed_at: userDataArray[0].profile_slug_changed_at as
            | string
            | null
            | undefined,
        }
      : undefined

  // Backfill auth_user_id if missing on existing record
  if (userData && userDataArray && userDataArray.length > 0) {
    const existingAuthUserId = userDataArray[0].auth_user_id as
      | string
      | null
      | undefined
    if (!existingAuthUserId && user.email) {
      await safeClient.updateUser(user.email, { auth_user_id: user.id })
    }
  }

  // If no user data exists, create a basic user record
  if (!userData && user.email) {
    console.log(
      'No user data found, creating basic user record for:',
      user.email
    )
    try {
      const { data: newUser, error: createError } = await safeClient.insertUser(
        {
          email: user.email,
          full_name: user.email.split('@')[0], // Use email prefix as fallback name
          auth_user_id: user.id,
          profile_slug: generateInitialProfileSlug(
            user.email.split('@')[0] || 'user',
            user.id
          ),
          profile_slug_changed_at: new Date().toISOString(),
          provider: 'email',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      )

      if (createError) {
        console.error('Error creating user record:', createError)
      } else {
        console.log('Successfully created user record:', newUser)
        if (newUser && typeof newUser === 'object') {
          const userRecord = newUser as {
            full_name?: string
            created_at?: string
            profile_slug?: string
            profile_slug_changed_at?: string | null
          }
          userData = {
            full_name: userRecord.full_name || user.email.split('@')[0],
            created_at: userRecord.created_at || new Date().toISOString(),
            profile_slug: userRecord.profile_slug,
            profile_slug_changed_at: userRecord.profile_slug_changed_at ?? null,
          }
        }
      }
    } catch (error) {
      console.error('Failed to create user record:', error)
    }
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
    id: user.id,
  }

  return (
    <AuthLayout title="Profile" subtitle="Manage your account and preferences">
      <ProfileClient
        user={clientUser}
        userData={userData}
        signOutAction={signOut}
      />
    </AuthLayout>
  )
}

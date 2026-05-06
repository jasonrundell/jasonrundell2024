'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const signOutAction = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await supabase.auth.signOut()
  console.info(
    JSON.stringify({
      event: 'auth.signout',
      email: user?.email,
      ts: new Date().toISOString(),
    })
  )
  return redirect('/sign-in')
}

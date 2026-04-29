import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let publicClient: ReturnType<typeof createSupabaseClient> | null = null

/**
 * Creates a cookie-free Supabase client for public, RLS-safe reads.
 */
export function createPublicClient() {
  if (publicClient) {
    return publicClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = 'Supabase public client environment variables are missing'
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  publicClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return publicClient
}

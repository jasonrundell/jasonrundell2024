import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseAnonKey } from './env'

let publicClient: ReturnType<typeof createSupabaseClient> | null = null

/**
 * Creates a cookie-free Supabase client for public, RLS-safe reads.
 * Throws if the required environment variables are missing.
 */
export function createPublicClient() {
  if (publicClient) {
    return publicClient
  }

  publicClient = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return publicClient
}

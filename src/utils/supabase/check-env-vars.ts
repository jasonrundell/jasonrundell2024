import { hasSupabaseEnv } from './env'

/**
 * True when both Supabase env vars are set.
 * Use this only for UI-level graceful degradation (e.g. SupabaseStatusBanner).
 * For actual clients, use the throwing accessors in `env.ts`.
 */
export const hasEnvVars = hasSupabaseEnv()

import { createClient } from '@/utils/supabase/server'

export interface SupabaseStatus {
  isAvailable: boolean
  isPaused: boolean
  error?: string
}

/**
 * Check if Supabase is available and not paused
 */
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  try {
    const supabase = await createClient()

    // Try a simple query to test connectivity
    const { error } = await supabase.from('users').select('id').limit(1)

    if (error) {
      // Check if it's a paused project error
      if (
        error.message.includes('paused') ||
        error.message.includes('suspended') ||
        error.message.includes('unavailable') ||
        error.code === 'PGRST301' || // Service unavailable
        error.code === 'PGRST302'
      ) {
        // Service paused
        return {
          isAvailable: false,
          isPaused: true,
          error: 'Supabase project is currently paused',
        }
      }

      return {
        isAvailable: false,
        isPaused: false,
        error: error.message,
      }
    }

    return {
      isAvailable: true,
      isPaused: false,
    }
  } catch (error) {
    // Network errors or other issues
    return {
      isAvailable: false,
      isPaused: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if Supabase is available with a timeout
 */
export async function checkSupabaseStatusWithTimeout(
  timeoutMs: number = 5000
): Promise<SupabaseStatus> {
  try {
    const timeoutPromise = new Promise<SupabaseStatus>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    })

    const statusPromise = checkSupabaseStatus()

    return await Promise.race([statusPromise, timeoutPromise])
  } catch (error) {
    return {
      isAvailable: false,
      isPaused: false,
      error: error instanceof Error ? error.message : 'Connection timeout',
    }
  }
}

/**
 * Get a user-friendly message for Supabase status
 */
export function getSupabaseStatusMessage(status: SupabaseStatus): string {
  if (status.isAvailable) {
    return 'Database is available'
  }

  if (status.isPaused) {
    return 'Database is currently paused. Please resume your Supabase project to continue.'
  }

  return status.error || 'Database is unavailable'
}

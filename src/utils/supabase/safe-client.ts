import { createClient } from './server'
import { checkSupabaseStatus, type SupabaseStatus } from './status'

export interface SafeSupabaseResult<T = unknown> {
  data: T | null
  error: string | null
  isPaused: boolean
  isAvailable: boolean
}

/**
 * Safe Supabase client that handles paused states
 */
export class SafeSupabaseClient {
  private status: SupabaseStatus | null = null
  private lastStatusCheck = 0
  private readonly STATUS_CACHE_DURATION = 30000 // 30 seconds

  /**
   * Check Supabase status with caching
   */
  private async getStatus(): Promise<SupabaseStatus> {
    const now = Date.now()

    if (
      !this.status ||
      now - this.lastStatusCheck > this.STATUS_CACHE_DURATION
    ) {
      this.status = await checkSupabaseStatus()
      this.lastStatusCheck = now
    }

    return this.status
  }

  /**
   * Execute a Supabase operation with pause handling
   */
  async execute<T>(
    operation: () => Promise<{ data: T | null; error: unknown }>
  ): Promise<SafeSupabaseResult<T>> {
    const status = await this.getStatus()

    if (!status.isAvailable) {
      return {
        data: null,
        error: status.error || 'Database unavailable',
        isPaused: status.isPaused,
        isAvailable: false,
      }
    }

    try {
      const result = await operation()
      return {
        data: result.data,
        error:
          result.error &&
          typeof result.error === 'object' &&
          'message' in result.error
            ? (result.error as { message: string }).message
            : null,
        isPaused: false,
        isAvailable: true,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        isPaused: false,
        isAvailable: false,
      }
    }
  }

  /**
   * Get user data safely
   */
  async getUser() {
    return this.execute(async () => {
      const supabase = await createClient()
      const result = await supabase.auth.getUser()
      return {
        data: result.data,
        error: result.error,
      }
    })
  }

  /**
   * Get session safely
   */
  async getSession() {
    return this.execute(async () => {
      const supabase = await createClient()
      const result = await supabase.auth.getSession()
      return {
        data: result.data,
        error: result.error,
      }
    })
  }

  /**
   * Sign out safely
   */
  async signOut() {
    return this.execute(async () => {
      const supabase = await createClient()
      const result = await supabase.auth.signOut()
      return {
        data: null,
        error: result.error,
      }
    })
  }

  /**
   * Query users table safely
   */
  async getUsers(email?: string) {
    return this.execute(async () => {
      const supabase = await createClient()
      let query = supabase.from('users').select('*')

      if (email) {
        query = query.eq('email', email)
      }

      return await query
    })
  }

  /**
   * Insert user safely
   */
  async insertUser(userData: Record<string, unknown>) {
    return this.execute(async () => {
      const supabase = await createClient()
      return await supabase.from('users').insert([userData]).select().single()
    })
  }

  /**
   * Update user safely
   */
  async updateUser(email: string, userData: Record<string, unknown>) {
    return this.execute(async () => {
      const supabase = await createClient()
      return await supabase
        .from('users')
        .update(userData)
        .eq('email', email)
        .select()
        .single()
    })
  }
}

/**
 * Create a safe Supabase client instance
 */
export function createSafeClient(): SafeSupabaseClient {
  return new SafeSupabaseClient()
}

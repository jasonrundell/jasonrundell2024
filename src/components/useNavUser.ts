'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export function useNavUser(): { user: User | null; isLoading: boolean } {
  const pathname = usePathname()
  const prevPathnameRef = useRef<string | undefined>(undefined)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applySession = useCallback((session: Session | null) => {
    const newUser = session?.user ?? null
    setUser((prev) => {
      if (prev?.id === newUser?.id) return prev
      return newUser
    })
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        applySession(session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })

    return () => subscription.unsubscribe()
  }, [applySession])

  /**
   * Server actions (e.g. sign-in) set session cookies and redirect. The
   * singleton browser client may not emit auth events for that update, so
   * re-load the session from cookie storage when the route changes.
   */
  useEffect(() => {
    if (prevPathnameRef.current === undefined) {
      prevPathnameRef.current = pathname
      return
    }
    if (prevPathnameRef.current === pathname) {
      return
    }
    prevPathnameRef.current = pathname

    const supabase = createClient()
    let cancelled = false

    const resyncSession = async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession()
        if (cancelled) return
        if (error) {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (!cancelled) applySession(session ?? null)
          return
        }
        applySession(data.session ?? null)
      } catch (error) {
        console.error('Error syncing session after navigation:', error)
      }
    }

    void resyncSession()
    return () => {
      cancelled = true
    }
  }, [pathname, applySession])

  return { user, isLoading }
}

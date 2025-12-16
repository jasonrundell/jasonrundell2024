'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

interface SupabaseStatus {
  isAvailable: boolean
  isPaused: boolean
  error?: string
}

const StyledBanner = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${Tokens.zIndex.banner.value};
  padding: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  text-align: center;
  font-weight: 400;
  transition: transform 0.3s ease-in-out;
  box-shadow: ${Tokens.shadows.medium.value} ${Tokens.colors.surface.value}1A;
  color: ${Tokens.colors.surface.value};

  &.paused {
    background: ${Tokens.colors.error.value};
  }

  &.error {
    background: ${Tokens.colors.warning.value};
  }

  &.available {
    background: ${Tokens.colors.success.value};
  }

  &.hidden {
    transform: translateY(-100%);
  }

  &.visible {
    transform: translateY(0);
  }
`

const Message = styled('p')`
  margin: 0;
  font-size: 0.9rem;
`

const ActionButton = styled('button')`
  background: white;
  border: 1px solid ${Tokens.colors.secondary.value}4D;
  color: ${Tokens.colors.surface.value};
  padding: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit} ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
  margin-left: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  cursor: pointer;
  font-family: var(--font-outfit), Arial, sans-serif;
  font-size: 0.8rem;
  transition: background 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${Tokens.colors.secondary.value}4D;
  }
`

const CloseButton = styled('button')`
  position: absolute;
  right: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  color: ${Tokens.colors.surface.value};
  cursor: pointer;
  font-size: 1.2rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`

interface SupabaseStatusBannerProps {
  showWhenAvailable?: boolean
  autoHide?: boolean
  hideDuration?: number
}

export default function SupabaseStatusBanner({
  showWhenAvailable = false,
  autoHide = true,
  hideDuration = 5000,
}: SupabaseStatusBannerProps) {
  const [status, setStatus] = useState<SupabaseStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const lastCheckRef = useRef<number>(0)
  const statusCacheRef = useRef<SupabaseStatus | null>(null)
  const cacheTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkStatus = useCallback(
    async (force = false) => {
      const now = Date.now()
      const CACHE_DURATION = 60000 // 1 minute cache

      // Use cached status if available and not expired
      if (
        !force &&
        statusCacheRef.current &&
        now - lastCheckRef.current < CACHE_DURATION
      ) {
        setStatus(statusCacheRef.current)
        setIsVisible(
          statusCacheRef.current.isPaused ||
            (statusCacheRef.current.isAvailable && showWhenAvailable) ||
            (!statusCacheRef.current.isAvailable &&
              !statusCacheRef.current.isPaused)
        )
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/supabase-status')
        const newStatus: SupabaseStatus = await response.json()

        // Cache the status
        statusCacheRef.current = newStatus
        lastCheckRef.current = now

        setStatus(newStatus)

        // Show banner if:
        // 1. Supabase is paused (always show)
        // 2. Supabase is available and showWhenAvailable is true
        // 3. There's an error (but not paused)
        const shouldShow =
          newStatus.isPaused ||
          (newStatus.isAvailable && showWhenAvailable) ||
          (!newStatus.isAvailable && !newStatus.isPaused)

        setIsVisible(shouldShow)

        // Auto-hide success messages
        if (autoHide && newStatus.isAvailable && showWhenAvailable) {
          if (cacheTimeoutRef.current) {
            clearTimeout(cacheTimeoutRef.current)
          }
          cacheTimeoutRef.current = setTimeout(
            () => setIsVisible(false),
            hideDuration
          )
        }
      } catch {
        setStatus({
          isAvailable: false,
          isPaused: false,
          error: 'Failed to check database status',
        })
        setIsVisible(true)
      } finally {
        setIsLoading(false)
      }
    },
    [showWhenAvailable, autoHide, hideDuration]
  )

  useEffect(() => {
    // Initial check
    checkStatus()

    // Check status every 2 minutes instead of 30 seconds
    const interval = setInterval(() => checkStatus(), 120000)

    return () => {
      clearInterval(interval)
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current)
      }
    }
  }, [checkStatus])

  const handleResumeClick = () => {
    window.open('https://app.supabase.com', '_blank')
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleRetry = () => {
    setIsLoading(true)
    checkStatus(true) // Force refresh
  }

  if (isLoading || !status) {
    return null
  }

  const getMessage = () => {
    if (status.isPaused) {
      return 'Database is currently paused. Please resume your Supabase project to continue.'
    }

    if (status.isAvailable) {
      return 'Database is available and running normally.'
    }

    return 'Database is currently paused. Please resume your Supabase project to continue.'
  }

  const getActionButton = () => {
    if (status.isPaused) {
      return (
        <ActionButton onClick={handleResumeClick}>Resume Project</ActionButton>
      )
    }

    if (!status.isAvailable && !status.isPaused) {
      return <ActionButton onClick={handleRetry}>Retry Connection</ActionButton>
    }

    return null
  }

  const getBannerClass = () => {
    if (status.isPaused) return 'paused'
    if (status.isAvailable) return 'available'
    return 'error'
  }

  return (
    <StyledBanner
      className={`${getBannerClass()} ${isVisible ? 'visible' : 'hidden'}`}
    >
      <Message>{getMessage()}</Message>
      {getActionButton()}
      <CloseButton onClick={handleClose} aria-label="Close banner">
        ×
      </CloseButton>
    </StyledBanner>
  )
}

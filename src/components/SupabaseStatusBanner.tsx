'use client'

import { useEffect, useState } from 'react'
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
  z-index: 1000;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: white;

  &.paused {
    background: ${Tokens.colors.error.value};
  }

  &.error {
    background: ${Tokens.colors.warning.value};
  }

  &.available {
    background: ${Tokens.colors.success?.value || '#10b981'};
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
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-left: 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

const CloseButton = styled('button')`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
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

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/supabase-status')
      const newStatus: SupabaseStatus = await response.json()
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
        setTimeout(() => setIsVisible(false), hideDuration)
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
  }

  useEffect(() => {
    checkStatus()

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleResumeClick = () => {
    window.open('https://app.supabase.com', '_blank')
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleRetry = () => {
    setIsLoading(true)
    checkStatus()
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

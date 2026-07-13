'use client'

import { styled } from '@pigment-css/react'
import { useEffect, useState } from 'react'
import Tokens from '@/lib/tokens'

interface BackToTopStyleProps {
  isVisible: boolean
}

const BackToTopStyle = styled('div')<BackToTopStyleProps>({
  position: 'fixed',
  bottom: `${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit}`,
  right: `${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit}`,
  backgroundColor: Tokens.colors.accent.var,
  color: Tokens.colors.onAccent.var,
  fontFamily: Tokens.fonts.body.var,
  fontSize: '0.8125rem',
  fontWeight: 600,
  padding: `${Tokens.sizes.padding.small.value}${Tokens.sizes.padding.small.unit} ${Tokens.sizes.padding.large.value}${Tokens.sizes.padding.large.unit}`,
  borderRadius: 0,
  cursor: 'pointer',
  transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.15s ease',
  '&:hover, &:focus-visible': {
    backgroundColor: Tokens.colors.accentSoft.var,
    transform: 'translateY(-2px)',
  },
  '&:focus-visible': {
    outline: `2px solid ${Tokens.colors.onAccent.var}`,
    outlineOffset: '2px',
  },
  variants: [
    {
      props: {
        isVisible: true,
      },
      style: {
        opacity: 1,
        visibility: 'visible',
      },
    },
    {
      props: {
        isVisible: false,
      },
      style: {
        opacity: 0,
        visibility: 'hidden',
      },
    },
  ],
})

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Add throttle function
  const throttle = (func: (...args: unknown[]) => void, limit: number) => {
    let inThrottle: boolean
    return function (this: unknown, ...args: unknown[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  useEffect(() => {
    const throttledToggleVisibility = throttle(toggleVisibility, 100)
    window.addEventListener('scroll', throttledToggleVisibility)
    return () => {
      window.removeEventListener('scroll', throttledToggleVisibility)
    }
  }, [])

  return (
    <BackToTopStyle
      onClick={scrollToTop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          scrollToTop()
        }
      }}
      role="button"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      aria-label="Back to top"
      isVisible={isVisible}
    >
      Back to top
    </BackToTopStyle>
  )
}

export default BackToTop

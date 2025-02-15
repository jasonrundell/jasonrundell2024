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
  backgroundColor: Tokens.colors.primary.value,
  color: Tokens.colors.surface.value,
  padding: `${10 / 16}rem ${Tokens.sizes.medium.value}${
    Tokens.sizes.medium.unit
  }`,
  borderRadius: `${5 / 16}rem`,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: Tokens.colors.secondary,
  },
  variants: [
    {
      props: {
        isVisible: true,
      },
      style: {
        display: 'block',
      },
    },
    {
      props: {
        isVisible: false,
      },
      style: {
        display: 'none',
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
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
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
          scrollToTop()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Back to top"
      isVisible={isVisible}
    >
      Back to top
    </BackToTopStyle>
  )
}

export default BackToTop

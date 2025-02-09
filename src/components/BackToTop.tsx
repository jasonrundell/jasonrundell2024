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

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <BackToTopStyle
      onClick={scrollToTop}
      onKeyPress={(e) => {
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

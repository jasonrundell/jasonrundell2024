'use client'

import { styled } from '@pigment-css/react'
import { useEffect, useState } from 'react'
import Tokens from '@/lib/tokens'

interface BackToTopStyleProps {
  isVisible: boolean
}

const BackToTopStyle = styled('div')<BackToTopStyleProps>({
  position: 'fixed',
  bottom: Tokens.sizes.xlarge,
  right: Tokens.sizes.xlarge,
  backgroundColor: '#e9be62',
  color: '#000',
  padding: '0.625rem 1.25rem',
  borderRadius: '0.3125rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#eee',
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

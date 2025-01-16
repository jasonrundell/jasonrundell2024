'use client'

import { styled } from '@pigment-css/react'
import { useEffect, useState } from 'react'
import Tokens from '@/lib/tokens'

interface BackToTopStyleProps {
  isVisible: boolean
}

const BackToTopStyle = styled('div')<BackToTopStyleProps>({
  position: 'fixed',
  bottom: `${Tokens.sizes.xlarge}rem`,
  right: `${Tokens.sizes.xlarge}rem`,
  backgroundColor: '#e9be62',
  color: '#000',
  padding: `${10 / 16}rem ${Tokens.sizes.medium}rem`,
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

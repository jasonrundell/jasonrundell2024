'use client'

import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { tokens } from '@/data/tokens'

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

  const BackToTopStyle = styled.div`
    position: fixed;
    bottom: ${tokens['--size-xlarge']};
    right: ${tokens['--size-xlarge']};
    background-color: #e9be62;
    color: #000;
    padding: 0.625rem 1.25rem;
    border-radius: 0.3125rem;
    cursor: pointer;
    display: ${isVisible ? 'block' : 'none'};
    &:hover {
      background-color: #eee;
    }
  `

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
    >
      Back to top
    </BackToTopStyle>
  )
}

export default BackToTop

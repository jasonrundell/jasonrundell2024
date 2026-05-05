'use client'

import { useEffect, useState } from 'react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { useNavUser } from './useNavUser'
import NavAuthControls from './NavAuthControls'
import MobileDrawer from './MobileDrawer'

const StyledMobileMenuButton = styled('button')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 0;
  margin-left: auto;

  span {
    display: block;
    width: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
    height: 2px;
    background-color: ${Tokens.colors.roleHeading.var};
    margin: 2px 0;
    transition: 0.3s;
    transform-origin: center;
  }

  &.open {
    span:nth-child(1) {
      transform: rotate(45deg) translate(3px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(3px, -6px);
    }
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}) {
    display: none;
  }
`

const StyledAuthButtonGroup = styled('div')`
  display: none;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  margin-left: auto;
  align-items: center;
  padding-right: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}) {
    display: flex;
    padding-right: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  }
`

const LARGE_BREAKPOINT_PX =
  parseFloat(String(Tokens.sizes.breakpoints.large.value)) *
  (Tokens.sizes.breakpoints.large.unit === 'rem' ? 16 : 1)

const MainNavClient: React.FC = () => {
  const { user, isLoading } = useNavUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const menu = document.getElementById('menu')
      if (menu) {
        menu.classList.toggle('scrolled', window.scrollY > 0)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= LARGE_BREAKPOINT_PX) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (isLoading) {
    return (
      <>
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Loading navigation
        </div>
        <StyledAuthButtonGroup>
          <div style={{ width: '120px', height: '32px' }} />
        </StyledAuthButtonGroup>
      </>
    )
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <StyledMobileMenuButton
        className={isMobileMenuOpen ? 'open' : ''}
        onClick={() => setIsMobileMenuOpen((o) => !o)}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span />
        <span />
        <span />
      </StyledMobileMenuButton>

      <NavAuthControls user={user} />

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        user={user}
        onClose={closeMobileMenu}
      />
    </>
  )
}

export default MainNavClient

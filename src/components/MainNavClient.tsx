'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/auth/ui/button'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { User } from '@supabase/supabase-js'

const StyledAuthButtonGroup = styled('div')`
  display: none;
  gap: 0.5rem;
  margin-left: auto;
  align-items: center;
  padding-right: 1rem;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: flex;
    padding-right: 2rem;
  }
`

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
    width: 1.5rem;
    height: 2px;
    background-color: ${Tokens.colors.secondary.value};
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

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: none;
  }
`

const StyledMobileMenu = styled('div')`
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: ${Tokens.colors.background.value};
  border-top: 1px solid ${Tokens.colors.border.value};
  padding: 1.5rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 98;

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: none;
  }
`

const StyledMobileList = styled('ul')`
  list-style: none;
  margin: 0 0 1.5rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledMobileListItem = styled('li')`
  a {
    color: ${Tokens.colors.secondary.value};
    text-decoration: none;
    font-size: 1.125rem;
    display: block;
    padding: 0.75rem 0;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;
    text-align: center;

    &:hover {
      border-bottom-color: ${Tokens.colors.primary.value};
    }
  }
`

const StyledMobileAuthSection = styled('div')`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  padding-top: 1.5rem;
  border-top: 1px solid ${Tokens.colors.border.value};
  align-items: center;

  form,
  a {
    width: 100%;
    max-width: 200px;
  }

  button {
    width: 100%;
    justify-content: center;
  }
`

interface MainNavClientProps {
  user: User | null
}

const MainNavClient: React.FC<MainNavClientProps> = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const menu = document.getElementById('menu')
      if (menu) {
        if (window.scrollY > 0) {
          menu.classList.add('scrolled')
        } else {
          menu.classList.remove('scrolled')
        }
      }
    }

    const handleResize = () => {
      // Close mobile menu when window is resized to larger screen
      if (window.innerWidth >= 1024) {
        // 64rem = 1024px at 16px base
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

  return (
    <>
      {/* Mobile Menu Button */}
      <StyledMobileMenuButton
        className={isMobileMenuOpen ? 'open' : ''}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </StyledMobileMenuButton>

      {/* Auth Buttons (Desktop) */}
      <StyledAuthButtonGroup>
        {user ? (
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        ) : (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </StyledAuthButtonGroup>

      {/* Mobile Menu */}
      <StyledMobileMenu className={isMobileMenuOpen ? 'open' : ''}>
        <StyledMobileList>
          <StyledMobileListItem>
            <Link href="/#blog" onClick={closeMobileMenu}>
              Blog
            </Link>
          </StyledMobileListItem>
          <StyledMobileListItem>
            <Link href="/#projects" onClick={closeMobileMenu}>
              Projects
            </Link>
          </StyledMobileListItem>
        </StyledMobileList>

        <StyledMobileAuthSection>
          {user ? (
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Log out
              </Button>
            </form>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in" onClick={closeMobileMenu}>
                  Login
                </Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/sign-up" onClick={closeMobileMenu}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </StyledMobileAuthSection>
      </StyledMobileMenu>
    </>
  )
}

export default MainNavClient

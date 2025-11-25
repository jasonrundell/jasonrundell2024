'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/auth/ui/button'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

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
  border-bottom: 1px solid ${Tokens.colors.border.value};
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
  a,
  button {
    color: ${Tokens.colors.secondary.value};
    text-decoration: none;
    font-size: 1.125rem;
    display: block;
    padding: 0.75rem 0;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;
    text-align: right;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    cursor: pointer;
    width: 100%;
    font-family: inherit;

    &:hover {
      border-bottom-color: ${Tokens.colors.primary.value};
    }
  }

  form {
    width: 100%;
  }

  form button {
    width: 100%;
  }
`

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MainNavClientProps {}

const MainNavClient: React.FC<MainNavClientProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes - only update if user actually changed
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user || null
      setUser((prev) => {
        // Only update if user ID actually changed
        if (prev?.id === newUser?.id) return prev
        return newUser
      })
    })

    return () => subscription.unsubscribe()
  }, [])

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

  // Show loading state briefly to avoid layout shift
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

  return (
    <>
      {/* Mobile Menu Button */}
      <StyledMobileMenuButton
        className={isMobileMenuOpen ? 'open' : ''}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </StyledMobileMenuButton>

      {/* Auth Buttons (Desktop) */}
      <StyledAuthButtonGroup>
        {user ? (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile">Profile</Link>
            </Button>
            <form action={signOutAction}>
              <Button type="submit" variant="default" size="sm">
                Log out
              </Button>
            </form>
          </>
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
      <StyledMobileMenu
        id="mobile-menu"
        className={isMobileMenuOpen ? 'open' : ''}
        aria-hidden={!isMobileMenuOpen}
      >
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
          {user ? (
            <>
              <StyledMobileListItem>
                <Link href="/profile">Profile</Link>
              </StyledMobileListItem>
              <StyledMobileListItem>
                <form action={signOutAction}>
                  <button type="submit">Log out</button>
                </form>
              </StyledMobileListItem>
            </>
          ) : (
            <>
              <StyledMobileListItem>
                <Link href="/sign-in" onClick={closeMobileMenu}>
                  Login
                </Link>
              </StyledMobileListItem>
              <StyledMobileListItem>
                <Link href="/sign-up" onClick={closeMobileMenu}>
                  Sign up
                </Link>
              </StyledMobileListItem>
            </>
          )}
        </StyledMobileList>
      </StyledMobileMenu>
    </>
  )
}

export default MainNavClient

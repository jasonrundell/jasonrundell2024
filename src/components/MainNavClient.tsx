'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/auth/ui/button'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'

const StyledAuthButtonGroup = styled('div')`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  padding-right: 2rem;
  align-items: center;
`

interface MainNavClientProps {
  user: any
}

const MainNavClient: React.FC<MainNavClientProps> = ({ user }) => {
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
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
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
  )
}

export default MainNavClient

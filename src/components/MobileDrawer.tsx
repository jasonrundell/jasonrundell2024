'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledMobileMenu = styled('div')`
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: ${Tokens.colors.surfaceBase.var};
  border-top: 1px solid ${Tokens.colors.border.var};
  border-bottom: 1px solid ${Tokens.colors.border.var};
  padding: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: ${Tokens.zIndex.base.value};

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}) {
    display: none;
  }
`

const StyledMobileList = styled('ul')`
  list-style: none;
  margin: 0 0 ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit} 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledMobileListItem = styled('li')`
  a,
  button {
    color: ${Tokens.colors.roleHeading.var};
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
      border-bottom-color: ${Tokens.colors.rolePrompt.var};
    }
  }

  form {
    width: 100%;
  }

  form button {
    width: 100%;
  }
`

interface MobileDrawerProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
}

export default function MobileDrawer({ isOpen, user, onClose }: MobileDrawerProps) {
  return (
    <StyledMobileMenu
      id="mobile-menu"
      className={isOpen ? 'open' : ''}
      aria-hidden={!isOpen}
    >
      <StyledMobileList>
        <StyledMobileListItem>
          <Link href="/about" onClick={onClose}>About</Link>
        </StyledMobileListItem>
        <StyledMobileListItem>
          <Link href="/projects" onClick={onClose}>Projects</Link>
        </StyledMobileListItem>
        <StyledMobileListItem>
          <Link href="/posts" onClick={onClose}>Blog</Link>
        </StyledMobileListItem>
        <StyledMobileListItem>
          <Link href="/contact" onClick={onClose}>Contact</Link>
        </StyledMobileListItem>
        {user ? (
          <>
            <StyledMobileListItem>
              <Link href="/profile" onClick={onClose}>Profile</Link>
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
              <Link href="/sign-in" onClick={onClose}>Sign in</Link>
            </StyledMobileListItem>
            <StyledMobileListItem>
              <Link href="/sign-up" onClick={onClose}>Sign up</Link>
            </StyledMobileListItem>
          </>
        )}
      </StyledMobileList>
    </StyledMobileMenu>
  )
}

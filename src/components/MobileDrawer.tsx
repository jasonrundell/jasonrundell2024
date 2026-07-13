'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { signOutAction } from '@/app/actions'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { NAV_LINKS } from '@/components/MainNav'

const StyledMobileMenu = styled('nav')`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${Tokens.colors.ink.var};
  color: ${Tokens.colors.onInk.var};
  padding: 2rem 1.25rem 3rem;
  display: flex;
  flex-direction: column;
  transform: translateY(-8px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    visibility 0.25s ease;
  z-index: ${Tokens.zIndex.overlay.value};
  overflow-y: auto;

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
  margin: 0 0 2rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const StyledMobileListItem = styled('li')`
  border-bottom: 1px solid rgba(247, 248, 250, 0.14);

  a,
  button {
    color: ${Tokens.colors.onInk.var};
    text-decoration: none;
    font-family: ${Tokens.fonts.heading.var};
    font-size: 1.75rem;
    font-weight: 500;
    display: block;
    padding: 1rem 0;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    font-family: ${Tokens.fonts.heading.var};

    &:hover,
    &:focus-visible {
      color: ${Tokens.colors.footerLink.var};
    }
  }

  form {
    width: 100%;
  }
`

const StyledMobileCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  padding: 0.875rem 1.5rem;
  background: ${Tokens.colors.accent.var};
  color: ${Tokens.colors.onAccent.var};
  font-family: ${Tokens.fonts.body.var};
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background: ${Tokens.colors.accentSoft.var};
  }
`

const StyledSecondaryList = styled('ul')`
  list-style: none;
  margin: 2rem 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

  a,
  button {
    color: ${Tokens.colors.footerLink.var};
    font-family: ${Tokens.fonts.monospace.var};
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      color: ${Tokens.colors.footerLinkHover.var};
    }
  }
`

interface MobileDrawerProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
}

export default function MobileDrawer({
  isOpen,
  user,
  onClose,
}: MobileDrawerProps) {
  return (
    <StyledMobileMenu
      id="mobile-menu"
      className={isOpen ? 'open' : ''}
      aria-label="Mobile navigation"
      {...(!isOpen ? { inert: '' as unknown as boolean } : {})}
    >
      <StyledMobileList>
        {NAV_LINKS.map((link) => (
          <StyledMobileListItem key={link.href}>
            <Link href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          </StyledMobileListItem>
        ))}
      </StyledMobileList>

      <StyledMobileCta href="/contact" onClick={onClose}>
        Book a chat
      </StyledMobileCta>

      <StyledSecondaryList>
        {user ? (
          <>
            <li>
              <Link href="/profile" onClick={onClose}>
                Profile
              </Link>
            </li>
            <li>
              <form action={signOutAction}>
                <button type="submit">Log out</button>
              </form>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-in" onClick={onClose}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/sign-up" onClick={onClose}>
                Sign up
              </Link>
            </li>
          </>
        )}
      </StyledSecondaryList>
    </StyledMobileMenu>
  )
}

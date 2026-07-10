import { styled } from '@pigment-css/react'
import Link from 'next/link'
import Tokens from '@/lib/tokens'
import MainNavClient from '@/components/MainNavClient'

const StyledMenuContainer = styled('div')`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${Tokens.zIndex.nav.value};
  background-color: ${Tokens.colors.surfacePrimary.var};
  transition: box-shadow 0.25s ease, background-color 0.25s ease;
`

const StyledMenu = styled('div')`
  display: flex;
  flex-direction: row;
  max-width: 75rem;
  margin: 0 auto;
  height: 4rem;
  align-items: center;
  padding: 0 1.25rem;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    padding: 0 4rem;
  }
`

const StyledBrand = styled(Link)`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${Tokens.colors.ink.var};
  text-decoration: none;
  text-wrap: nowrap;

  &:hover {
    color: ${Tokens.colors.accent.var};
  }
`

const StyledDesktopNav = styled('nav')`
  display: none;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: flex;
  }
`

const StyledList = styled('ul')`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  flex-direction: row;
  align-items: center;
  gap: 1.75rem;
`

const StyledListItem = styled('li')`
  display: flex;

  a {
    font-family: ${Tokens.fonts.body.var};
    font-size: 0.9375rem;
    color: ${Tokens.colors.inkMuted.var};
    text-decoration: none;
    text-wrap: nowrap;
    transition: color 0.15s ease;
  }

  a:hover {
    color: ${Tokens.colors.ink.var};
  }
`

const StyledNavCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${Tokens.colors.accent.var};
  color: ${Tokens.colors.onAccent.var};
  font-family: ${Tokens.fonts.body.var};
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid ${Tokens.colors.accent.var};
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${Tokens.colors.accentSoft.var};
    border-color: ${Tokens.colors.accentSoft.var};
  }
`

/** Primary site navigation. Editorial brand + links + a single primary CTA. */
export const NAV_LINKS = [
  { href: '/how-i-lead', label: 'How I lead' },
  { href: '/projects', label: 'Selected work' },
  { href: '/posts', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const

export default function MainNav() {
  return (
    <StyledMenuContainer id="menu">
      <StyledMenu>
        <StyledBrand href="/">Jason Rundell</StyledBrand>

        <StyledDesktopNav aria-label="Main Navigation">
          <StyledList>
            {NAV_LINKS.map((link) => (
              <StyledListItem key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </StyledListItem>
            ))}
          </StyledList>
          <StyledNavCta href="/contact">Book a conversation</StyledNavCta>
        </StyledDesktopNav>

        <MainNavClient />
      </StyledMenu>
    </StyledMenuContainer>
  )
}

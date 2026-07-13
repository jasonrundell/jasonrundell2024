import React from 'react'
import Link from 'next/link'
import { styled } from '@pigment-css/react'
import BackToTop from './BackToTop'
import ContactList from './ContactList'
import Tokens from '@/lib/tokens'

const StyledFooter = styled('footer')`
  background-color: ${Tokens.colors.ink.var};
  color: ${Tokens.colors.onInk.var};
`

const StyledInner = styled('div')`
  width: 100%;
  margin: 0 auto;
  max-width: 75rem;
  padding: 3.5rem 1.25rem 3rem;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    padding: 4.5rem 4rem 3rem;
  }
`

const StyledTop = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 3rem;
  }
`

const StyledLede = styled('div')`
  h2 {
    font-family: ${Tokens.fonts.heading.var};
    color: ${Tokens.colors.onInk.var};
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin: 0 0 0.75rem;
  }

  p {
    color: ${Tokens.colors.footerLink.var};
    max-width: 40ch;
  }
`

const StyledColHeading = styled('h3')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${Tokens.colors.footerLink.var};
  margin: 0 0 1rem;
`

const StyledNavList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  a {
    color: ${Tokens.colors.footerLink.var};
    font-family: ${Tokens.fonts.body.var};
    font-size: 0.9375rem;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: ${Tokens.colors.footerLinkHover.var};
    text-decoration: underline;
  }
`

const StyledModes = styled('div')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${Tokens.colors.footerLink.var};
  margin: 3rem 0 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(247, 248, 250, 0.14);
`

const StyledColophon = styled('div')`
  margin-top: 1.5rem;

  small {
    color: ${Tokens.colors.footerLink.var};
    font-size: 0.8125rem;
  }

  a {
    color: ${Tokens.colors.footerLinkHover.var};
  }
`

const EXPLORE_LINKS = [
  { href: '/how-i-lead', label: 'How I lead' },
  { href: '/projects', label: 'Selected work' },
  { href: '/posts', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Book a chat' },
] as const

/** Global footer - dark band with lede, Explore/Connect columns, modes note. */
export default async function Footer() {
  return (
    <StyledFooter id="contact">
      <StyledInner>
        <StyledTop>
          <StyledLede>
            <h2>Let&rsquo;s talk about your next inflection point.</h2>
            <p>
              Full-time leadership, fractional engineering leadership, or
              selective hands-on work - start with a conversation.
            </p>
          </StyledLede>

          <nav aria-label="Footer">
            <StyledColHeading>Explore</StyledColHeading>
            <StyledNavList>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </StyledNavList>
          </nav>

          <div>
            <StyledColHeading>Connect</StyledColHeading>
            <ContactList />
          </div>
        </StyledTop>

        <StyledModes>
          Engagement modes: Full-time leadership (Canada) · Fractional CTO / VP
          Eng · Selective hands-on builds via Infinite Source Agency (US/UK
          contract).
        </StyledModes>

        <StyledColophon>
          <small>
            © Jason Rundell {new Date().getFullYear()}. All rights reserved.
            Design consulting from{' '}
            <Link
              href="https://donnavitan.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donna Vitan
            </Link>
            .
          </small>
        </StyledColophon>

        <BackToTop />
      </StyledInner>
    </StyledFooter>
  )
}

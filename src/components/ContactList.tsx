import Link from 'next/link'
import { styled } from '@pigment-css/react'
import { Mail, Calendar, Linkedin, Github } from 'lucide-react'
import Tokens from '@/lib/tokens'

const StyledList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const StyledItem = styled('li')`
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
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

  svg {
    flex-shrink: 0;
  }
`

const CONTACT_LINKS = [
  {
    href: 'mailto:contact@jasonrundell.com',
    label: 'contact@jasonrundell.com',
    external: false,
    Icon: Mail,
  },
  {
    href: 'https://calendly.com/jason-rundell/60-minute-meeting',
    label: 'Book time with me',
    external: true,
    Icon: Calendar,
  },
  {
    href: 'https://www.linkedin.com/in/jasonrundell/',
    label: 'LinkedIn',
    external: true,
    Icon: Linkedin,
  },
  {
    href: 'https://github.com/jasonrundell?tab=repositories',
    label: 'GitHub',
    external: true,
    Icon: Github,
  },
] as const

export default function ContactList() {
  return (
    <StyledList aria-label="Ways to reach me">
      {CONTACT_LINKS.map((link) => (
        <StyledItem key={link.href}>
          {link.external ? (
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <link.Icon size={16} aria-hidden="true" />
              {link.label}
            </Link>
          ) : (
            <Link href={link.href}>
              <link.Icon size={16} aria-hidden="true" />
              {link.label}
            </Link>
          )}
        </StyledItem>
      ))}
    </StyledList>
  )
}

import Link from 'next/link'

import Icon from './Icon'
import { StyledList, StyledListItem } from '@/styles/common'

export default function ContactList() {
  return (
    <StyledList>
      <StyledListItem>
        <Icon type="Email" />{' '}
        <Link
          href="mailto:contact@jasonrundell.com"
          aria-label="Email me"
          className="link"
        >
          Email me
        </Link>
      </StyledListItem>
      <StyledListItem>
        <Icon type="Calendar" />{' '}
        <Link
          href="https://calendly.com/jason-rundell/60-minute-meeting"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Book time with me"
          className="link"
        >
          Book time with me
        </Link>
      </StyledListItem>
      <StyledListItem>
        <Icon type="GitHub" />{' '}
        <Link
          href="https://github.com/jasonrundell?tab=repositories&q=&type=&language=&sort="
          rel="noopener noreferrer"
          target="_blank"
          aria-label="My open-source work on GitHub"
          className="link"
        >
          My open-source work on GitHub
        </Link>
      </StyledListItem>
      <StyledListItem>
        <Icon type="LinkedIn" />{' '}
        <Link
          href="https://www.linkedin.com/in/jasonrundell/"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Connect on LinkedIn"
          className="link"
        >
          Connect on LinkedIn
        </Link>
      </StyledListItem>
    </StyledList>
  )
}

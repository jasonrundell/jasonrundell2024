import Icon from './Icon'
import { ExternalLink } from 'lucide-react'
import { StyledList, StyledListItem, StyledLink } from '@/styles/common'

export default function ContactList() {
  return (
    <StyledList>
      <StyledListItem>
        <Icon type="Email" />{' '}
        <StyledLink
          href="mailto:contact@jasonrundell.com"
          aria-label="Email me"
        >
          Email me
        </StyledLink>
      </StyledListItem>
      <StyledListItem>
        <Icon type="Calendar" />{' '}
        <StyledLink
          href="https://calendly.com/jason-rundell/60-minute-meeting"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Book time with me"
        >
          <ExternalLink size={18} /> Book time with me
        </StyledLink>
      </StyledListItem>
      <StyledListItem>
        <Icon type="GitHub" />{' '}
        <StyledLink
          href="https://github.com/jasonrundell?tab=repositories&q=&type=&language=&sort="
          rel="noopener noreferrer"
          target="_blank"
          aria-label="My open-source work on GitHub"
        >
          <ExternalLink size={18} /> My open-source work on GitHub
        </StyledLink>
      </StyledListItem>
      <StyledListItem>
        <Icon type="LinkedIn" />{' '}
        <StyledLink
          href="https://www.linkedin.com/in/jasonrundell/"
          rel="noopener noreferrer"
          target="_blank"
          aria-label="Connect on LinkedIn"
        >
          <ExternalLink size={18} /> Connect on LinkedIn
        </StyledLink>
      </StyledListItem>
    </StyledList>
  )
}

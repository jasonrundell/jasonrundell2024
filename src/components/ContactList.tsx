import { Link } from '@jasonrundell/dropship'

import Icon from './Icon'

import { StyledList, StyledListItem } from '@/styles/common'

const ContactList: React.FC = () => {
  return (
    <StyledList>
      <StyledListItem>
        <Icon type="Email" />{' '}
        <Link href="mailto:contact@jasonrundell.com" label="Email me" />
      </StyledListItem>
      <StyledListItem>
        <Icon type="Calendar" />{' '}
        <Link
          href="https://calendly.com/jason-rundell/60-minute-meeting"
          rel="noopener noreferrer"
          target="_blank"
          label="Book time with me"
        />
      </StyledListItem>
      <StyledListItem>
        <Icon type="GitHub" />{' '}
        <Link
          href="https://github.com/jasonrundell?tab=repositories&q=&type=&language=&sort="
          rel="noopener noreferrer"
          target="_blank"
          label="My open-source work on GitHub"
        />
      </StyledListItem>
      <StyledListItem>
        <Icon type="LinkedIn" />{' '}
        <Link
          href="https://www.linkedin.com/in/jasonrundell/"
          rel="noopener noreferrer"
          target="_blank"
          label="Connect on LinkedIn"
        />
      </StyledListItem>
    </StyledList>
  )
}

export default ContactList

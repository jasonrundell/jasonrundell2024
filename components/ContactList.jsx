import { Link } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import Icon from './Icon'

const ContactList = () => {
  const StyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    width: 100%;
  `

  const StyledListItem = styled.li`
    margin: 0;
    padding: 0.25rem 0;
  `
  return (
    <StyledList>
      <StyledListItem>
        <Icon type="Email" />{' '}
        <Link href="mailto:contact@jaosnrundell.com" label="Email me" />
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

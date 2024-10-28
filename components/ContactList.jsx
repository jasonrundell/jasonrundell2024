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

  const StylesListItem = styled.li`
    margin: 0;
    padding: 0.25rem 0;
  `
  return (
    <StyledList>
      <StylesListItem>
        <Icon type="Email" />{' '}
        <Link href="mailto:contact@jaosnrundell.com" label="Email me" />
      </StylesListItem>
      <StylesListItem>
        <Icon type="Calendar" />{' '}
        <Link
          href="https://calendly.com/jason-rundell/60-minute-meeting"
          rel="noopener noreferrer"
          target="_blank"
          label="Book time with me"
        />
      </StylesListItem>
      <StylesListItem>
        <Icon type="GitHub" />{' '}
        <Link
          href="https://github.com/jasonrundell?tab=repositories&q=&type=&language=&sort="
          rel="noopener noreferrer"
          target="_blank"
          label="My open-source work on GitHub"
        />
      </StylesListItem>
      <StylesListItem>
        <Icon type="LinkedIn" />{' '}
        <Link
          href="https://www.linkedin.com/in/jasonrundell/"
          rel="noopener noreferrer"
          target="_blank"
          label="Connect on LinkedIn"
        />
      </StylesListItem>
    </StyledList>
  )
}

export default ContactList

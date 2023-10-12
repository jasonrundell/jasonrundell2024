import { Heading, Paragraph, Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import styled from '@emotion/styled'

import Container from './container'
import { tokens } from '../data/tokens'

const Footer = () => {
  const StyledFooter = styled.footer`
    background-color: ${tokens['--background-color-3']};
  `

  return (
    <StyledFooter id="contact">
      <Container>
        <div className="py-20 flex flex-col items-center">
          <Heading level={3} label="Let's Connect" classNames="font-bold" />
          <Row>
            <ul>
              <li>
                <Link href="mailto:contact@jasonrundell.com">
                  contact@jasonrundell.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/jasonrundell"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/jasonrundell/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </Row>
        </div>
        <div className="py-20 flex flex-col items-center">
          <Paragraph>
            <small>
              Site design by{' '}
              <Link
                href="https://donnavitan.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Donna Vitan
              </Link>
              ❤️ © Jason Rundell {new Date().getFullYear()}. All rights
              reserved.
            </small>
          </Paragraph>
        </div>
      </Container>
    </StyledFooter>
  )
}

export default Footer

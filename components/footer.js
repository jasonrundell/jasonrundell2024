import { Box, Heading, Paragraph, Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import Container from './container'

export default function Footer() {
  return (
    <footer className="bg--darkest">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <Heading level={3} label="Let' Connect" classNames="font-bold" />
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
        <Box>
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
        </Box>
      </Container>
    </footer>
  )
}

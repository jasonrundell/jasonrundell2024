import { Heading, Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
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
      </Container>
    </footer>
  )
}

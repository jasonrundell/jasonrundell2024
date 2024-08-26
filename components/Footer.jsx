import { useState, useEffect } from 'react'
import { Heading, Paragraph, Row } from '@jasonrundell/dropship'
import Link from 'next/link'
import styled from '@emotion/styled'
import Container from './container'
import Character from './Character'

import { tokens } from '../data/tokens'
import { characters } from '../data/characters'

// choose a random index from characters array
var randomIndex = Math.floor(Math.random() * characters.length)

const Footer = () => {
  const StyledFooter = styled.footer`
    background-color: ${tokens['--background-color-3']};
  `

  const [randomCharacter, setRandomCharacter] = useState(null)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * characters.length)
    setRandomCharacter(characters[randomIndex])
  }, [])

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
          <Row>
            <Paragraph>
              Sneak peak at interactive characters I&apos;m trying to integrate
              into my site to add some fun and creativity!
            </Paragraph>
          </Row>
          <Row>
            {randomCharacter && <Character character={randomCharacter} />}
          </Row>
          <Row>
            <Paragraph>
              <small>
                © Jason Rundell {new Date().getFullYear()}. All rights reserved.
              </small>
            </Paragraph>
          </Row>
        </div>

        <div className="py-20 flex flex-col items-center"></div>
      </Container>
    </StyledFooter>
  )
}

export default Footer

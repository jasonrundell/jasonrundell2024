import { useState, useEffect } from 'react'
import { Row, Spacer } from '@jasonrundell/dropship'
import styled from '@emotion/styled'
import BackToTop from './BackToTop'
import ContactList from './ContactList'
import { tokens } from '../data/tokens'
import { characters } from '../data/characters'

// choose a random index from characters array
var randomIndex = Math.floor(Math.random() * characters.length)

const Footer = () => {
  const [randomCharacter, setRandomCharacter] = useState(null)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * characters.length)
    setRandomCharacter(characters[randomIndex])
  }, [])

  const StyledFooter = styled.footer`
    background-color: ${tokens['--background-color-3']};
  `

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 768px) {
      margin: 0 auto;
      max-width: 64rem;
    }
  `
  const StyledSection = styled.section`
    padding: ${tokens['--size-xlarge']} 0;
  `

  return (
    <StyledFooter id="contact">
      <StyledContainer>
        <StyledSection>
          {/* <p>
            Sneak peak at interactive characters I&apos;m trying to integrate
            into my site to add some fun and creativity!
          </p> */}
          {/* {randomCharacter && (
            <Row>
              <Character character={randomCharacter} />
            </Row>
          )} */}
          <Spacer />
          <h2>Contact me</h2>
          <Row>
            <ContactList />
          </Row>
          <Spacer />
          <Row>
            <p>
              <small>
                © Jason Rundell {new Date().getFullYear()}. All rights reserved.
              </small>
            </p>
          </Row>

          <BackToTop />
        </StyledSection>
      </StyledContainer>
    </StyledFooter>
  )
}

export default Footer

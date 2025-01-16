import React from 'react'
import { Row, Spacer } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import BackToTop from './BackToTop'
import ContactList from './ContactList'
// import Character from './Character'
import Tokens from '@/lib/tokens'
import { StyledContainer, StyledSection } from '@/styles/common'

const StyledFooter = styled('footer')`
  background-color: ${Tokens.colors.background3};
`

const Footer: React.FC = () => {
  return (
    <StyledFooter id="contact">
      <StyledContainer>
        <StyledSection>
          {/* <p>
            Sneak peak at interactive characters I&apos;m trying to integrate
            into my site to add some fun and creativity!
          </p> */}
          {/* <Row>
            <Character />
          </Row> */}
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
                Design consulting from{' '}
                <a href="https://donnavitan.com">Donna Vitan</a> ❤️.
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

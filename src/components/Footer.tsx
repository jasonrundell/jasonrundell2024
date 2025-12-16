import React from 'react'
import { Row, Spacer } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import BackToTop from './BackToTop'
import ContactList from './ContactList'
import Tokens from '@/lib/tokens'
import { StyledContainer, StyledSection, StyledLink } from '@/styles/common'

const StyledFooter = styled('footer')`
  background-color: ${Tokens.colors.backgroundDarker.value};
  padding-bottom: 4rem;
`

/**
 * Footer component with contact information and copyright.
 */
export default async function Footer() {
  return (
    <StyledFooter id="contact">
      <StyledContainer>
        <StyledSection>
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
                <StyledLink href="https://donnavitan.com" target="_blank" rel="noopener noreferrer">
                  Donna Vitan
                </StyledLink>{' '}
                ❤️
              </small>
            </p>
          </Row>
          <BackToTop />
        </StyledSection>
      </StyledContainer>
    </StyledFooter>
  )
}

'use client'

import React from 'react'
import { Row, Spacer } from '@jasonrundell/dropship'
import styled from '@emotion/styled'
import BackToTop from './BackToTop'
import ContactList from './ContactList'
// import Character from './Character'
import { tokens } from '../data/tokens'

const Footer = () => {
  const StyledFooter = styled.footer`
    background-color: ${tokens['--background-color-3']};
  `

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 48rem) {
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
          <p>
            Sneak peak at interactive characters I&apos;m trying to integrate
            into my site to add some fun and creativity!
          </p>
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

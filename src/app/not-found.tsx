import Link from 'next/link'
import { styled } from '@pigment-css/react'
import { Heading } from '@jasonrundell/dropship'

import Tokens from '@/lib/tokens'

const StyledContainer = styled('div')`
  padding: 0 ${Tokens.sizes.large}rem;
  margin-bottom: ${Tokens.sizes.large}rem;

  @media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
    margin: 0 auto;
    max-width: ${Tokens.sizes.breakpoints.large}rem;
  }
`

export default async function NotFound() {
  return (
    <StyledContainer>
      <Heading level={2}>404 - Page Not Found</Heading>
      <p>Could not find requested page.</p>
      <Link href="/">Return Home</Link>
    </StyledContainer>
  )
}

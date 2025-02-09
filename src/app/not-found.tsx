import Link from 'next/link'
import { styled } from '@pigment-css/react'
import { Heading } from '@jasonrundell/dropship'

import Tokens from '@/lib/tokens'

const StyledContainer = styled('div')`
  padding: 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  margin-bottom: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    margin: 0 auto;
    max-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit};
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

'use client'

import Link from 'next/link'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const StyledContainer = styled('div')({
  padding: `0 ${Tokens.sizes.large}`,
  marginBottom: `${Tokens.sizes.large}rem`,
  '@media (min-width: 48rem)': {
    margin: '0 auto',
    maxWidth: `${Tokens.sizes.breakpoints.large}rem`,
  },
})

const NotFound = () => {
  return (
    <StyledContainer>
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested page.</p>
      <Link href="/">Return Home</Link>
    </StyledContainer>
  )
}

export default NotFound

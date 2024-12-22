'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { tokens } from '@/data/tokens'

const NotFound = () => {
  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};
    margin-bottom: ${tokens['--size-large']};
    @media (min-width: 48rem) {
      margin: 0 auto ${tokens['--size-large']} auto;
      max-width: 64rem;
    }
  `
  return (
    <StyledContainer>
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested page.</p>
      <Link href="/">Return Home</Link>
    </StyledContainer>
  )
}

export default NotFound

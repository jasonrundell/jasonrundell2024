'use client'

import { styled, keyframes } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const StyledSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledSongInfo = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledSkeleton = styled('div')`
  background: linear-gradient(
    90deg,
    ${Tokens.colors.backgroundDark.value} 0%,
    ${Tokens.colors.background.value} 50%,
    ${Tokens.colors.backgroundDark.value} 100%
  );
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
`

const StyledTitleSkeleton = styled(StyledSkeleton)`
  height: 1.5rem;
  width: 8rem;
`

const StyledArtistSkeleton = styled(StyledSkeleton)`
  height: 1.25rem;
  width: 12rem;
`

const StyledActions = styled('div')`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const StyledButtonSkeleton = styled(StyledSkeleton)`
  height: 2.5rem;
  width: 5rem;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
`

const StyledLinkSkeleton = styled(StyledSkeleton)`
  height: 1.5rem;
  width: 10rem;
`

export default function LastSongSkeleton() {
  return (
    <StyledSection>
      <StyledSongInfo>
        <StyledTitleSkeleton aria-hidden="true" />
        <StyledArtistSkeleton aria-hidden="true" />
      </StyledSongInfo>
      <StyledActions>
        <StyledButtonSkeleton aria-hidden="true" />
        <StyledLinkSkeleton aria-hidden="true" />
      </StyledActions>
    </StyledSection>
  )
}


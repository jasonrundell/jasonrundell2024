'use client'

import { styled, keyframes } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { StyledFlexSection } from '@/styles/common'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const StyledSongInfo = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
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
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
`

const StyledTitleSkeleton = styled(StyledSkeleton)`
  height: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  width: 8rem;
`

const StyledArtistSkeleton = styled(StyledSkeleton)`
  height: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  width: 12rem;
`

const StyledActions = styled('div')`
  display: flex;
  gap: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  align-items: center;
`

const StyledButtonSkeleton = styled(StyledSkeleton)`
  height: 2.5rem;
  width: 5rem;
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
`

const StyledLinkSkeleton = styled(StyledSkeleton)`
  height: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  width: 10rem;
`

export default function LastSongSkeleton() {
  return (
    <StyledFlexSection>
      <StyledSongInfo>
        <StyledTitleSkeleton aria-hidden="true" />
        <StyledArtistSkeleton aria-hidden="true" />
      </StyledSongInfo>
      <StyledActions>
        <StyledButtonSkeleton aria-hidden="true" />
        <StyledLinkSkeleton aria-hidden="true" />
      </StyledActions>
    </StyledFlexSection>
  )
}

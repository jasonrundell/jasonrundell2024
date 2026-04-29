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

export const SkeletonBlock = styled('div')`
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

export const SkeletonAuthor = styled(SkeletonBlock)`
  height: 0.875rem;
  width: 7rem;
`

export const SkeletonDate = styled(SkeletonBlock)`
  height: 0.875rem;
  width: 5rem;
`

export const SkeletonBodyLine = styled(SkeletonBlock)`
  height: 1rem;
  width: 100%;
`

export const SkeletonBodyLineShort = styled(SkeletonBlock)`
  height: 1rem;
  width: 60%;
`

export const SkeletonTextarea = styled(SkeletonBlock)`
  height: 100px;
  width: 100%;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
`

export const SkeletonButton = styled(SkeletonBlock)`
  height: 2.25rem;
  width: 7.5rem;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
`

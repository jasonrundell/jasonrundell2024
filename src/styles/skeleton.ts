import { styled, keyframes } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

/**
 * Shared skeleton / shimmer animation and block primitive.
 * Used by CommentsSection and any other loading placeholder.
 */

export const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const SkeletonBlock = styled('div')`
  background: linear-gradient(
    90deg,
    ${Tokens.colors.surfaceDeepest.var} 25%,
    ${Tokens.colors.surfaceElevated.var} 50%,
    ${Tokens.colors.surfaceDeepest.var} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${Tokens.borderRadius.small.value}${Tokens.borderRadius.small.unit};
`

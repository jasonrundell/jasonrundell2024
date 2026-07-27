import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

/**
 * Continuous-line stand-in for projects that have no featured image.
 *
 * Mirrors the `LA Project Placeholder` component in `design/site.pen`: a
 * hairline window mark on paper with exactly one accent focal dot, so an
 * imageless row keeps the same 3:2 box and visual weight as a real thumbnail.
 * Purely decorative - it carries no information the copy does not already give.
 */

const StyledSvg = styled('svg')`
  display: block;
  width: 100%;
  height: 100%;
  background-color: ${Tokens.colors.surfacePrimary.var};
`

export default function ProjectPlaceholder() {
  return (
    <StyledSvg
      viewBox="0 0 200 150"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M28 30 H172 V120 H28 Z M28 50 H172 M46 70 H124 M46 88 H154 M46 106 H100"
        fill="none"
        stroke={Tokens.colors.illoInk.var}
        strokeWidth={1.5}
      />
      <circle cx="158" cy="106" r="6.5" fill={Tokens.colors.accent.var} />
    </StyledSvg>
  )
}

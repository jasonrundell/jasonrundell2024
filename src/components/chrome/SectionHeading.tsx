'use client'

import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'
import {
  REVEAL_FADE_DURATION_MS,
  fadeUpKeyframes,
  useReveal,
} from '@/styles/motion'

const StyledSectionComment = styled('span')`
  display: block;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${Tokens.colors.accent.var};
  margin-bottom: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const StyledHeadingWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 0 0 ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit} 0;

  h2,
  h3 {
    margin: 0;
    font-family: ${Tokens.fonts.heading.family};
    color: ${Tokens.colors.ink.var};
  }

  &[data-reveal-state='hidden'] > [data-section-comment],
  &[data-reveal-state='hidden'] > h2,
  &[data-reveal-state='hidden'] > h3 {
    opacity: 0;
    transform: translateY(8px);
  }

  &[data-reveal-state='visible'] > [data-section-comment],
  &[data-reveal-state='visible'] > h2,
  &[data-reveal-state='visible'] > h3 {
    animation: ${fadeUpKeyframes} ${REVEAL_FADE_DURATION_MS}ms ease-out both;
  }
`

export type SectionHeadingLevel = 2 | 3

interface SectionHeadingProps {
  /**
   * Eyebrow label rendered in monospace above the heading (e.g. `Selected
   * work`). Marked aria-hidden so the heading itself remains the announced
   * label.
   */
  comment: string
  /** Heading text. */
  children: React.ReactNode
  /** Heading level. Defaults to h2. h3 is supported for nested sections. */
  level?: SectionHeadingLevel
  /** Optional id forwarded to the heading element. */
  id?: string
  /** Optional aria-label forwarded to the heading element. */
  'aria-label'?: string
}

/**
 * Section heading with the refined-terminal "// section.tsx" comment header
 * sitting above an h2/h3.
 *
 * Phase 4 introduced the static syntax-highlight chrome. Phase 6 layers the
 * Tier 2 reveal on top: when the heading scrolls into view for the first
 * time, the comment line "types in" via a clip-path keyframe and the
 * heading itself fades up after the comment finishes. Already-onscreen
 * headings (e.g. above-the-fold ones at page load) skip the animation and
 * render in their settled state, and reduced-motion users bypass it
 * entirely.
 */
export default function SectionHeading({
  comment,
  children,
  level = 2,
  id,
  ...rest
}: SectionHeadingProps) {
  const Heading = level === 3 ? 'h3' : 'h2'
  const [ref, state] = useReveal<HTMLDivElement>()

  return (
    <StyledHeadingWrapper ref={ref} data-reveal-state={state}>
      <StyledSectionComment data-section-comment aria-hidden="true">
        {comment}
      </StyledSectionComment>
      <Heading id={id} {...rest}>
        {children}
      </Heading>
    </StyledHeadingWrapper>
  )
}

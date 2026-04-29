import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledSectionComment = styled('span')`
  display: block;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.textSecondary.var};
  margin-bottom: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
  letter-spacing: 0.02em;
`

const StyledHeadingWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 0 0 ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit} 0;

  h2,
  h3 {
    margin: 0;
  }
`

export type SectionHeadingLevel = 2 | 3

interface SectionHeadingProps {
  /**
   * The "filename" portion of the syntax-highlight chrome comment line,
   * e.g. `skills.tsx`. Rendered as `// {comment}` above the heading and
   * marked aria-hidden so the heading itself remains the announced label.
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
 * sitting above an h2/h3. Phase 4 syntax-highlight chrome — applied at every
 * h2 across pages so prose still reads like a calm IDE.
 */
export default function SectionHeading({
  comment,
  children,
  level = 2,
  id,
  ...rest
}: SectionHeadingProps) {
  const Heading = level === 3 ? 'h3' : 'h2'

  return (
    <StyledHeadingWrapper>
      <StyledSectionComment aria-hidden="true">
        {`// ${comment}`}
      </StyledSectionComment>
      <Heading id={id} {...rest}>
        {children}
      </Heading>
    </StyledHeadingWrapper>
  )
}

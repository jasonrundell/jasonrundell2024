import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledPre = styled('pre')`
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  line-height: 1.6;
  color: ${Tokens.colors.roleBody.var};
  background-color: ${Tokens.colors.surfaceDeepest.var};
  border: 1px solid ${Tokens.colors.surfaceElevated.var};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  margin: 0;
  padding: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`

const StyledComment = styled('span')`
  color: ${Tokens.colors.textSecondary.var};
`

const StyledKeyword = styled('span')`
  color: ${Tokens.colors.rolePrompt.var};
`

const StyledIdentifier = styled('span')`
  color: ${Tokens.colors.roleInfo.var};
`

const StyledKey = styled('span')`
  color: ${Tokens.colors.roleHeading.var};
`

const StyledString = styled('span')`
  color: ${Tokens.colors.roleSuccess.var};
`

export interface HeroConstField {
  key: string
  value: string
}

interface HeroConstDeclarationProps {
  /** Filename comment header, e.g. `hero.tsx`. */
  comment?: string
  /** Variable name (defaults to `session`). */
  identifier?: string
  /** Object fields to render inside the const declaration. */
  fields: ReadonlyArray<HeroConstField>
}

/**
 * Static syntax-highlighted `const` declaration for the homepage hero. Phase 4
 * ships the settled visual; Phase 5 will replace it with the animated
 * `HeroTerminal` while keeping the same visual end-state. The declaration is
 * decorative — `aria-hidden="true"` so the canonical `<h1>` remains the
 * announced heading.
 */
export default function HeroConstDeclaration({
  comment = 'hero.tsx',
  identifier = 'session',
  fields,
}: HeroConstDeclarationProps) {
  return (
    <StyledPre aria-hidden="true">
      <StyledComment>{`// ${comment}\n`}</StyledComment>
      <StyledKeyword>const</StyledKeyword>
      {' '}
      <StyledIdentifier>{identifier}</StyledIdentifier>
      {' = {\n'}
      {fields.map((field, index) => (
        <React.Fragment key={field.key}>
          {'  '}
          <StyledKey>{field.key}</StyledKey>
          {': '}
          <StyledString>{`'${field.value}'`}</StyledString>
          {index < fields.length - 1 ? ',\n' : ',\n'}
        </React.Fragment>
      ))}
      {'}'}
    </StyledPre>
  )
}

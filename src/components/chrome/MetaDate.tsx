import React from 'react'
import { format } from 'date-fns'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledMetaDate = styled('time')`
  font-family: ${Tokens.fonts.monospace.family};
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  color: ${Tokens.colors.roleInfo.var};
  letter-spacing: 0.02em;

  &::before {
    content: '// ';
  }
`

interface MetaDateProps {
  /** ISO-ish date string parseable by `new Date(...)`. */
  dateString: string
  /** date-fns format string. Defaults to `LLLL d, yyyy`. */
  formatString?: string
}

/**
 * Date metadata rendered with the refined-terminal chrome — cyan, monospaced,
 * leading `// ` glyph. The component is the canonical date renderer for
 * post and project preview cards, blog post headers, and any other
 * "metadata" surface.
 */
export default function MetaDate({
  dateString,
  formatString = 'LLLL d, yyyy',
}: MetaDateProps) {
  return (
    <StyledMetaDate dateTime={dateString}>
      {format(new Date(dateString), formatString)}
    </StyledMetaDate>
  )
}

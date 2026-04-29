import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

const StyledPromptList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
`

const StyledPromptItem = styled('li')`
  display: flex;
  align-items: baseline;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  margin: 0;
  padding: 0;
  color: ${Tokens.colors.roleBody.var};
  line-height: 1.5;

  &::before {
    content: '>';
    flex-shrink: 0;
    width: 1ch;
    font-family: ${Tokens.fonts.monospace.family};
    color: ${Tokens.colors.roleSuccess.var};
    font-weight: 600;
  }
`

interface PromptListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode
}

/**
 * Refined-terminal list. Renders an unordered list whose items lead with a
 * green `>` glyph (color reinforced by the glyph itself, never carrying
 * meaning alone). Use `PromptList.Item` for items so styling stays
 * encapsulated.
 */
function PromptList({ children, ...rest }: PromptListProps) {
  return <StyledPromptList {...rest}>{children}</StyledPromptList>
}

interface PromptItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

function PromptItem({ children, ...rest }: PromptItemProps) {
  return <StyledPromptItem {...rest}>{children}</StyledPromptItem>
}

PromptList.Item = PromptItem

export default PromptList
export { PromptItem }

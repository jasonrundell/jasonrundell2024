'use client'

import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'
import {
  REVEAL_SLIDE_DURATION_MS,
  REVEAL_STAGGER_INTERVAL_MS,
  slideInKeyframes,
  useReveal,
} from '@/styles/motion'

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

  [data-reveal-state='hidden'] > & {
    opacity: 0;
    transform: translateX(-8px);
  }

  [data-reveal-state='visible'] > & {
    animation: ${slideInKeyframes} ${REVEAL_SLIDE_DURATION_MS}ms ease-out
      forwards;
    animation-delay: calc(
      var(--stagger-index, 0) * ${REVEAL_STAGGER_INTERVAL_MS}ms
    );
  }
`

interface PromptListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode
}

/**
 * Refined-terminal list. Renders an unordered list whose items lead with a
 * green `>` glyph (color reinforced by the glyph itself, never carrying
 * meaning alone). Use the named `PromptItem` export for items so styling
 * stays encapsulated.
 *
 * Phase 6 layers a Tier 2 reveal on top: the `<ul>` carries the
 * `data-reveal-state` attribute and items slide in alongside their `>`
 * glyph at `REVEAL_STAGGER_INTERVAL_MS` intervals. The stagger index is
 * injected per-child via inline style so the CSS can derive the delay
 * declaratively. Reveals collapse to the settled state under
 * reduced-motion / no-IO / already-onscreen.
 *
 * Note: `PromptList` is a client component (it uses `useReveal`). React
 * Server Components cannot serialise a static property like
 * `PromptList.Item` across the server/client boundary, so the item must be
 * imported as the named `PromptItem` export everywhere it is used in the
 * tree.
 */
function PromptList({ children, ...rest }: PromptListProps) {
  const [ref, state] = useReveal<HTMLUListElement>()

  const staggered = React.Children.toArray(children).map((child, index) => {
    if (!React.isValidElement(child)) return child

    const element = child as React.ReactElement<{
      style?: React.CSSProperties
    }>
    const mergedStyle = {
      ...(element.props.style ?? {}),
      '--stagger-index': index,
    } as React.CSSProperties

    return React.cloneElement(element, { style: mergedStyle })
  })

  return (
    <StyledPromptList ref={ref} data-reveal-state={state} {...rest}>
      {staggered}
    </StyledPromptList>
  )
}

interface PromptItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

function PromptItem({ children, ...rest }: PromptItemProps) {
  return <StyledPromptItem {...rest}>{children}</StyledPromptItem>
}

export default PromptList
export { PromptItem }

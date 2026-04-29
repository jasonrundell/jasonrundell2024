'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { styled, keyframes } from '@pigment-css/react'

import Tokens from '@/lib/tokens'

export interface HeroConstField {
  key: string
  value: string
}

/**
 * In-session "user already chose to skip" flag. Set when a visitor cancels
 * the typewriter by interacting with the page; honoured on subsequent
 * in-session navigations / refreshes so a returning reader isn't forced to
 * sit through the same animation again. New tabs / new sessions still get
 * the animated session.
 */
export const HERO_TERMINAL_SKIP_KEY = 'jr:hero-terminal:skip'

/**
 * Default per-character cadence. ~40ms × ~120 chars ≈ ~5s, landing inside
 * the ~5–7s "total terminal session" budget defined by the design plan.
 */
const DEFAULT_TYPE_INTERVAL_MS = 40

type Role = 'comment' | 'keyword' | 'identifier' | 'key' | 'string' | 'plain'

interface Segment {
  text: string
  role: Role
}

interface HeroTerminalProps {
  fields: ReadonlyArray<HeroConstField>
  /** Canonical, SR-only `<h1>` announced by assistive tech. */
  heading: string
  /** SR-only pitch sentence announced by assistive tech. */
  pitch: string
  /** Variable name printed in the session (defaults to `session`). */
  identifier?: string
  /** Filename comment header (defaults to `hero.tsx`). */
  comment?: string
  /** Override per-character cadence in ms. Used by tests / tuning. */
  typeIntervalMs?: number
}

function buildSegments(
  comment: string,
  identifier: string,
  fields: ReadonlyArray<HeroConstField>
): Segment[] {
  const out: Segment[] = []
  out.push({ text: `// ${comment}\n`, role: 'comment' })
  out.push({ text: 'const', role: 'keyword' })
  out.push({ text: ' ', role: 'plain' })
  out.push({ text: identifier, role: 'identifier' })
  out.push({ text: ' = {\n', role: 'plain' })
  fields.forEach((field, index) => {
    out.push({ text: '  ', role: 'plain' })
    out.push({ text: field.key, role: 'key' })
    out.push({ text: ': ', role: 'plain' })
    out.push({ text: `'${field.value}'`, role: 'string' })
    out.push({ text: index < fields.length - 1 ? ',\n' : '\n', role: 'plain' })
  })
  out.push({ text: '}', role: 'plain' })
  return out
}

function totalLength(all: ReadonlyArray<Segment>): number {
  return all.reduce((sum, seg) => sum + seg.text.length, 0)
}

function sliceSegments(all: ReadonlyArray<Segment>, n: number): Segment[] {
  if (n <= 0) return []
  const out: Segment[] = []
  let remaining = n
  for (const seg of all) {
    if (remaining <= 0) break
    if (seg.text.length <= remaining) {
      out.push(seg)
      remaining -= seg.text.length
    } else {
      out.push({ text: seg.text.slice(0, remaining), role: seg.role })
      remaining = 0
    }
  }
  return out
}

const cursorBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`

const StyledFigure = styled('figure')`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
`

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
  min-height: 8rem;
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

const StyledCursor = styled('span')`
  display: inline-block;
  margin-left: 0.05em;
  color: ${Tokens.colors.rolePrompt.var};

  &[data-blink='true'] {
    animation: ${cursorBlink} 1s step-end infinite;
  }
`

function renderSegment(segment: Segment, index: number) {
  switch (segment.role) {
    case 'comment':
      return <StyledComment key={index}>{segment.text}</StyledComment>
    case 'keyword':
      return <StyledKeyword key={index}>{segment.text}</StyledKeyword>
    case 'identifier':
      return <StyledIdentifier key={index}>{segment.text}</StyledIdentifier>
    case 'key':
      return <StyledKey key={index}>{segment.text}</StyledKey>
    case 'string':
      return <StyledString key={index}>{segment.text}</StyledString>
    case 'plain':
    default:
      return <span key={index}>{segment.text}</span>
  }
}

/**
 * Animated terminal hero. Owns the typewriter session so the rest of the
 * homepage can stay declarative:
 *
 * - Types out a syntax-highlighted `const session = { ... }` block, then
 *   parks a blinking cursor at the prompt.
 * - Cancels to settled state on any keypress / pointer / wheel / scroll /
 *   touch input and persists an in-session skip flag in `sessionStorage`.
 * - Bypasses motion entirely when `prefers-reduced-motion: reduce` is set.
 * - Always renders an SR-only `<h1>` + pitch in static DOM so assistive
 *   tech sees a stable, canonical heading regardless of animation phase.
 *
 * The 3-doors row is intentionally NOT part of this component. The
 * homepage composes the layout (image → terminal → intro → doors) so the
 * doors can sit below the intro paragraph that prompts the visitor to
 * "pick a door". The doors get their own Tier 2 scroll reveal in
 * `src/app/page.tsx`.
 */
export default function HeroTerminal({
  fields,
  heading,
  pitch,
  identifier = 'session',
  comment = 'hero.tsx',
  typeIntervalMs = DEFAULT_TYPE_INTERVAL_MS,
}: HeroTerminalProps) {
  const segments = useMemo(
    () => buildSegments(comment, identifier, fields),
    [comment, identifier, fields]
  )
  const total = useMemo(() => totalLength(segments), [segments])

  // SSR + first paint render the fully settled state so no-JS visitors and
  // hydration both see the canonical end-state. The mount effect below
  // decides whether to wind back into the typing animation.
  const [charsTyped, setCharsTyped] = useState<number>(total)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const skippedRef = useRef(false)

  // Decide initial phase on the client.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let sessionSkip = false
    try {
      sessionSkip =
        window.sessionStorage.getItem(HERO_TERMINAL_SKIP_KEY) === '1'
    } catch {
      // Sandboxed iframes / strict privacy modes may throw on access.
    }

    if (reducedMotion || sessionSkip) {
      return
    }

    setCharsTyped(0)
    setIsAnimating(true)
    // `total` is captured once on mount; intentionally not in deps so the
    // animation isn't restarted if `fields` re-render-equal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drive the typewriter forward + register skip listeners while animating.
  useEffect(() => {
    if (!isAnimating) return

    const persistSkip = () => {
      if (skippedRef.current) return
      skippedRef.current = true
      try {
        window.sessionStorage.setItem(HERO_TERMINAL_SKIP_KEY, '1')
      } catch {
        // sessionStorage may be unavailable; non-fatal.
      }
    }

    const onSkip = () => {
      persistSkip()
      setCharsTyped(total)
      setIsAnimating(false)
    }

    const interval = window.setInterval(() => {
      setCharsTyped((prev) => (prev + 1 >= total ? total : prev + 1))
    }, typeIntervalMs)

    window.addEventListener('keydown', onSkip)
    window.addEventListener('pointerdown', onSkip)
    window.addEventListener('touchstart', onSkip, { passive: true })
    window.addEventListener('wheel', onSkip, { passive: true })
    window.addEventListener('scroll', onSkip, { passive: true })

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('pointerdown', onSkip)
      window.removeEventListener('touchstart', onSkip)
      window.removeEventListener('wheel', onSkip)
      window.removeEventListener('scroll', onSkip)
    }
  }, [isAnimating, total, typeIntervalMs])

  // Mark animation complete once the typewriter reaches the end. Kept as a
  // separate effect so `setIsAnimating` is never called from inside a
  // `setCharsTyped` updater (which React flags as a side effect in render).
  useEffect(() => {
    if (isAnimating && charsTyped >= total) {
      setIsAnimating(false)
    }
  }, [charsTyped, total, isAnimating])

  const visibleSegments = sliceSegments(segments, charsTyped)
  const isSettled = !isAnimating && charsTyped >= total

  return (
    <section data-testid="hero-terminal" aria-label="Hero">
      <h1 className="sr-only">{heading}</h1>
      <p className="sr-only">{pitch}</p>
      <StyledFigure>
        <StyledPre aria-hidden="true">
          {visibleSegments.map(renderSegment)}
          <StyledCursor data-blink={isSettled ? 'true' : 'false'}>
            {'\u25AE'}
          </StyledCursor>
        </StyledPre>
      </StyledFigure>
    </section>
  )
}

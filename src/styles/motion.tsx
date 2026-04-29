'use client'

/**
 * Tier 2 scroll-reveal motion module — the single place where one-shot
 * IntersectionObserver-driven reveals are implemented for the refined
 * terminal aesthetic.
 *
 * Design intent (deep module, simple interface):
 * - `useReveal` owns the IntersectionObserver lifecycle and a small state
 *   machine (`ready` → `hidden` → `visible`) that is friendly to SSR,
 *   no-JS, reduced-motion, and "already on screen at mount" cases.
 * - `Reveal` is a fade-up wrapper for a single element.
 * - `RevealStaggerGroup` + `RevealStaggerItem` orchestrate staggered
 *   fade-ups for sibling cards in a grid via React Context, so the
 *   IntersectionObserver only attaches to the parent.
 * - Keyframes are exported for components (SectionHeading, PromptList)
 *   that need bespoke reveal timing on internal nodes.
 *
 * Reduced motion is the source of truth: when the OS reports
 * `prefers-reduced-motion: reduce`, every reveal short-circuits to the
 * settled `ready` state and no animation is dispatched. The global CSS
 * guard in `globals.css` is a belt-and-braces backup that collapses any
 * stray animation duration to ~0ms.
 *
 * The file uses the `.tsx` extension because the `Reveal` /
 * `RevealStaggerGroup` / `RevealStaggerItem` exports are React components
 * authored with JSX. Imports stay `from '@/styles/motion'` — Next/Webpack
 * resolves the extension automatically.
 */

import React, { useEffect, useRef, useState } from 'react'
import { keyframes, styled } from '@pigment-css/react'

/** Duration of the fade-up reveal keyframe. Tier 2: short and one-shot. */
export const REVEAL_FADE_DURATION_MS = 350

/** Duration of the typewriter clip-reveal used by section comment headers. */
export const REVEAL_TYPE_DURATION_MS = 250

/** Duration of the `>`-glyph slide-in for prompt list items. */
export const REVEAL_SLIDE_DURATION_MS = 300

/** Per-child stagger interval for grid card reveals. Locked by design plan. */
export const REVEAL_STAGGER_INTERVAL_MS = 50

/**
 * State machine for a reveal:
 * - `ready`   : settled / visible. SSR + reduced-motion + no-IO bypass + the
 *               "already in view at mount" path all rest here. No animation.
 * - `hidden`  : armed. Element is offscreen and waiting to reveal. CSS hides
 *               it.
 * - `visible` : in view. CSS plays the reveal animation once.
 */
export type RevealState = 'ready' | 'hidden' | 'visible'

interface UseRevealOptions {
  /** IntersectionObserver `threshold`. Default 0.15. */
  threshold?: number
  /** IntersectionObserver `rootMargin`. Default `0px 0px -8% 0px`. */
  rootMargin?: string
}

const DEFAULT_THRESHOLD = 0.15
const DEFAULT_ROOT_MARGIN = '0px 0px -8% 0px'

/**
 * One-shot scroll reveal hook. Returns a ref to attach to the element you
 * want to reveal and a `RevealState` that should be forwarded as
 * `data-reveal-state={state}` so CSS can drive the animation.
 *
 * Behaviour summary:
 * - SSR / first paint: `ready` (visible, no animation).
 * - Reduced motion or missing IntersectionObserver: stays `ready`.
 * - Element already in viewport on mount: stays `ready` (no flash, no
 *   animation, just a quiet visible render).
 * - Element offscreen on mount: transitions to `hidden`, then to `visible`
 *   once it scrolls into view. Disconnects after firing.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): [React.RefObject<T>, RevealState] {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>('ready')

  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN

  useEffect(() => {
    if (typeof window === 'undefined') return

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    if (typeof IntersectionObserver === 'undefined') return

    const node = ref.current
    if (!node) return

    let armed = false
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.some((entry) => entry.isIntersecting)

        if (!armed) {
          armed = true
          if (intersecting) {
            observer.disconnect()
            return
          }
          setState('hidden')
          return
        }

        if (intersecting) {
          setState('visible')
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, state]
}

/**
 * Fade-up reveal keyframe. Used by `Reveal`, `RevealStaggerItem`, and the
 * section heading reveal in chrome/SectionHeading.tsx.
 */
export const fadeUpKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

/**
 * Horizontal slide-in keyframe. Used by chrome/PromptList.tsx so list items
 * reveal alongside their `>` glyph.
 */
export const slideInKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

/**
 * Clip-path typewriter reveal. Used by chrome/SectionHeading.tsx for the
 * `// section.tsx` comment line.
 */
export const typeInKeyframes = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
`

const StyledReveal = styled('div')`
  &[data-reveal-state='hidden'] {
    opacity: 0;
    transform: translateY(8px);
  }

  &[data-reveal-state='visible'] {
    animation: ${fadeUpKeyframes} ${REVEAL_FADE_DURATION_MS}ms ease-out
      forwards;
    animation-delay: var(--reveal-delay, 0ms);
  }
`

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Optional extra delay (ms) before the fade-up runs. */
  delayMs?: number
}

/**
 * Generic Tier 2 fade-up reveal wrapper. Wrap a single element to have it
 * fade up on first viewport entry. For grids of siblings, prefer
 * `RevealStaggerGroup` so they share one IntersectionObserver and stagger.
 */
export function Reveal({ children, delayMs, style, ...rest }: RevealProps) {
  const [ref, state] = useReveal<HTMLDivElement>()
  const mergedStyle =
    delayMs && delayMs > 0
      ? ({
          ...style,
          '--reveal-delay': `${delayMs}ms`,
        } as React.CSSProperties)
      : style

  return (
    <StyledReveal
      ref={ref}
      data-reveal-state={state}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </StyledReveal>
  )
}

interface RevealStaggerContextValue {
  state: RevealState
}

const RevealStaggerContext =
  React.createContext<RevealStaggerContextValue | null>(null)

const StyledStaggerGroup = styled('div')``

interface RevealStaggerGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Container that owns the IntersectionObserver for a group of staggered
 * reveals. Use with `RevealStaggerItem` to fade siblings in at
 * `REVEAL_STAGGER_INTERVAL_MS` intervals.
 */
export function RevealStaggerGroup({
  children,
  ...rest
}: RevealStaggerGroupProps) {
  const [ref, state] = useReveal<HTMLDivElement>()
  return (
    <RevealStaggerContext.Provider value={{ state }}>
      <StyledStaggerGroup ref={ref} data-reveal-state={state} {...rest}>
        {children}
      </StyledStaggerGroup>
    </RevealStaggerContext.Provider>
  )
}

const StyledStaggerItem = styled('div')`
  &[data-reveal-state='hidden'] {
    opacity: 0;
    transform: translateY(8px);
  }

  &[data-reveal-state='visible'] {
    animation: ${fadeUpKeyframes} ${REVEAL_FADE_DURATION_MS}ms ease-out
      forwards;
    animation-delay: calc(
      var(--stagger-index, 0) * ${REVEAL_STAGGER_INTERVAL_MS}ms
    );
  }
`

interface RevealStaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Zero-based position in the stagger sequence. */
  index: number
  children: React.ReactNode
}

/**
 * Sibling within a `RevealStaggerGroup`. Reads the group's reveal state via
 * context and applies a per-index animation delay so cards stagger their
 * fade-up.
 */
export function RevealStaggerItem({
  index,
  children,
  style,
  ...rest
}: RevealStaggerItemProps) {
  const ctx = React.useContext(RevealStaggerContext)
  const state = ctx?.state ?? 'ready'
  const mergedStyle = {
    ...style,
    '--stagger-index': index,
  } as React.CSSProperties

  return (
    <StyledStaggerItem
      data-reveal-state={state}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </StyledStaggerItem>
  )
}

import React from 'react'
import Link from 'next/link'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

/**
 * Editorial design primitives - the single source for the leadership/craft
 * visual system (paper ground, forest accent, Newsreader + Geist + IBM Plex
 * Mono). Pages compose these instead of re-declaring band/heading/CTA styles.
 *
 * Deep module, simple interface: consumers import <Band>, <SectionHeader>,
 * <PrimaryCta> etc. and never touch raw tokens for chrome.
 */

const bp = `${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes.breakpoints.medium.unit}`

/** Full-bleed vertical band. `data-tone` swaps the ground colour. */
export const Band = styled('section')`
  width: 100%;
  padding: 3.5rem 0;
  background-color: ${Tokens.colors.surfacePrimary.var};
  color: ${Tokens.colors.ink.var};

  @media (min-width: ${bp}) {
    padding: 4.5rem 0;
  }

  &[data-tone='surface'] {
    background-color: ${Tokens.colors.surfaceSecondary.var};
    border-top: 1px solid ${Tokens.colors.lineSubtle.var};
    border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};
  }

  &[data-tone='ink'] {
    background-color: ${Tokens.colors.ink.var};
    color: ${Tokens.colors.onInk.var};
  }
`

export function BandSection({
  tone = 'paper',
  children,
  ...rest
}: {
  tone?: 'paper' | 'surface' | 'ink'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Band data-tone={tone} {...rest}>
      {children}
    </Band>
  )
}

/** Centered content container with page gutters. */
export const Container = styled('div')`
  width: 100%;
  padding: 0 1.25rem;
  margin: 0 auto;

  @media (min-width: ${bp}) {
    padding: 0 4rem;
    max-width: 75rem;
  }
`

/** Accent hairline with endcaps - the recurring systems-map motif. */
const RuleWrap = styled('span')`
  display: inline-flex;
  align-items: center;
`
const RuleCap = styled('span')`
  display: inline-block;
  width: 1.5px;
  height: 9px;
  background: ${Tokens.colors.accent.var};
`
const RuleLine = styled('span')`
  display: inline-block;
  height: 1.5px;
  background: ${Tokens.colors.accent.var};
`

export function AccentRule({ width = 48 }: { width?: number }) {
  return (
    <RuleWrap aria-hidden="true">
      <RuleCap />
      <RuleLine style={{ width }} />
      <RuleCap />
    </RuleWrap>
  )
}

/** Monospace craft label (eyebrows, metrics, category tags). */
export const MonoLabel = styled('span')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${Tokens.colors.accent.var};
`

const EyebrowStack = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

export function Eyebrow({ label }: { label: string }) {
  return (
    <EyebrowStack>
      <AccentRule />
      <MonoLabel>{label}</MonoLabel>
    </EyebrowStack>
  )
}

export const DisplayTitle = styled('h1')`
  font-family: ${Tokens.fonts.heading.var};
  font-weight: 600;
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: ${Tokens.colors.ink.var};
  margin: 0 0 1rem;
`

export const SectionTitle = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-weight: 600;
  font-size: clamp(1.75rem, 3.5vw, 2.375rem);
  line-height: 1.15;
  color: ${Tokens.colors.ink.var};
  margin: 0;
`

export const Lead = styled('p')`
  font-family: ${Tokens.fonts.body.var};
  font-size: 1.1875rem;
  line-height: 1.6;
  color: ${Tokens.colors.inkMuted.var};
  max-width: 60ch;
  margin: 1rem 0 0;

  @media (min-width: ${bp}) {
    font-size: 1.3125rem;
  }
`

const HeaderWrap = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 60ch;
`

export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
}) {
  return (
    <HeaderWrap>
      {eyebrow ? <Eyebrow label={eyebrow} /> : null}
      <SectionTitle>{title}</SectionTitle>
      {intro ? <Lead>{intro}</Lead> : null}
    </HeaderWrap>
  )
}

/** Solid forest CTA - sharp corners, no glow. */
export const PrimaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.375rem;
  background: ${Tokens.colors.accent.var};
  color: ${Tokens.colors.onAccent.var};
  font-family: ${Tokens.fonts.body.var};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid ${Tokens.colors.accent.var};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background: ${Tokens.colors.accentSoft.var};
    border-color: ${Tokens.colors.accentSoft.var};
    color: ${Tokens.colors.onAccent.var};
  }
`

/** Text link with arrow - secondary action, no pill. */
export const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${Tokens.colors.ink.var};
  font-family: ${Tokens.fonts.body.var};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.15s ease,
    gap 0.15s ease;

  &:hover,
  &:focus-visible {
    color: ${Tokens.colors.accent.var};
    gap: 0.6rem;
  }
`

export const CtaRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.75rem;
`

/** Hairline divider between rows. */
export const HairRule = styled('hr')`
  border: none;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
  margin: 0;
  width: 100%;
`

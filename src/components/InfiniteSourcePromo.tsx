import React from 'react'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'
import { PromptList, PromptItem } from '@/components/chrome'
import { SectionHeader } from '@/styles/editorial'

export type PromoService = {
  title: string
  description: string
}

export type PromoVenture = {
  name: string
  category: string
  tagline: string
  status: string
  href?: string
}

export const INFINITE_SOURCE_URL = 'https://infinitesource.agency'

export const INFINITE_SOURCE_SERVICES: ReadonlyArray<PromoService> = [
  {
    title: 'Web Development',
    description:
      'Custom websites built with modern tools for speed and lasting quality.',
  },
  {
    title: 'UI/UX Design',
    description:
      'Intuitive, beautiful experiences that convert visitors into customers.',
  },
  {
    title: 'Web App Development',
    description: 'Responsive web apps that perform flawlessly on every device.',
  },
  {
    title: 'Digital Strategy',
    description:
      'SEO, analytics, and growth tactics that turn presence into results.',
  },
] as const

export const INFINITE_SOURCE_VENTURES: ReadonlyArray<PromoVenture> = [
  {
    name: 'SpokenLeaf',
    category: 'Software',
    tagline: 'Where spoken thoughts become written ones.',
    status: 'Launching Q3/Q4 2026',
    href: 'https://spokenleaf.com',
  },
  {
    name: 'Primitive Legacy',
    category: 'Games',
    tagline: 'A roleplay-first online RPG where deeds become legend.',
    status: 'In development',
  },
  {
    name: 'Sudokune',
    category: 'Games',
    tagline: 'Ad-free, cross-device Sudoku. Pure focus.',
    status: 'Coming soon',
  },
  {
    name: 'MonstraCore',
    category: 'Games',
    tagline: 'A turn-based monster battler, easy to pick up, deep to master.',
    status: 'Coming to Steam',
  },
  {
    name: 'TZYX',
    category: 'Music',
    tagline: 'Ambient, space-electronic music on the Infinite Source label.',
    status: 'Debut album now out',
    href: 'https://suno.com/@tzyx',
  },
] as const

const StyledIntro = styled('p')`
  font-size: 1.1875rem;
  line-height: 1.6;
  color: ${Tokens.colors.inkMuted.var};
  max-width: 60ch;
  margin-top: 1rem;

  strong {
    color: ${Tokens.colors.ink.var};
  }
`

const StyledGrid = styled('div')`
  display: grid;
  gap: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  grid-template-columns: 1fr;
  margin: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit} 0 0 0;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    grid-template-columns: 1fr 1fr;
    gap: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  }
`

const StyledColumnLabel = styled('span')`
  display: block;
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${Tokens.colors.accent.var};
  margin-bottom: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const StyledItemTitle = styled('span')`
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
`

const StyledItemMeta = styled('span')`
  color: ${Tokens.colors.inkMuted.var};
`

const StyledStatus = styled('span')`
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.8125rem;
  color: ${Tokens.colors.inkFaint.var};
`

const StyledVentureLink = styled('a')`
  color: ${Tokens.colors.ink.var};
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${Tokens.colors.accent.var};
    text-decoration: underline;
  }
`

const StyledCtaRow = styled('div')`
  margin-top: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
`

const StyledCtaLink = styled('a')`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.375rem;
  background: ${Tokens.colors.accent.var};
  border: 1px solid ${Tokens.colors.accent.var};
  font-family: ${Tokens.fonts.body.family};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${Tokens.colors.onAccent.var};
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Tokens.colors.accentSoft.var};
    border-color: ${Tokens.colors.accentSoft.var};
  }
`

/**
 * Homepage promo for Infinite Source Agency Inc. - the web agency and creative
 * studio Jason founded and runs. Surfaces the agency's client services and its
 * in-house ventures (software, games, and music) with a CTA out to the site.
 */
export default function InfiniteSourcePromo() {
  return (
    <>
      <SectionHeader eyebrow="Studio" title="Infinite Source Agency Inc." />
      <StyledIntro>
        I founded and run <strong>Infinite Source Agency Inc.</strong>{' '}
        (September 2025), a web agency and creative studio. We build
        professional websites and web apps for clients - and craft our own
        software, games, and music.
      </StyledIntro>

      <StyledGrid>
        <div>
          <StyledColumnLabel aria-hidden="true">Services</StyledColumnLabel>
          <PromptList aria-label="Infinite Source services">
            {INFINITE_SOURCE_SERVICES.map((service) => (
              <PromptItem key={service.title}>
                <span>
                  <StyledItemTitle>{service.title}</StyledItemTitle>
                  {' - '}
                  <StyledItemMeta>{service.description}</StyledItemMeta>
                </span>
              </PromptItem>
            ))}
          </PromptList>
        </div>

        <div>
          <StyledColumnLabel aria-hidden="true">Ventures</StyledColumnLabel>
          <PromptList aria-label="Infinite Source ventures">
            {INFINITE_SOURCE_VENTURES.map((venture) => (
              <PromptItem key={venture.name}>
                <span>
                  {venture.href ? (
                    <StyledVentureLink
                      href={venture.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {venture.name}
                    </StyledVentureLink>
                  ) : (
                    <StyledItemTitle>{venture.name}</StyledItemTitle>
                  )}
                  {' - '}
                  <StyledItemMeta>{venture.tagline}</StyledItemMeta>{' '}
                  <StyledStatus>({venture.status})</StyledStatus>
                </span>
              </PromptItem>
            ))}
          </PromptList>
        </div>
      </StyledGrid>

      <StyledCtaRow>
        <StyledCtaLink
          href={INFINITE_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit infinitesource.agency →
        </StyledCtaLink>
      </StyledCtaRow>
    </>
  )
}

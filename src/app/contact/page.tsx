import React from 'react'
import type { Metadata } from 'next'
import { styled } from '@pigment-css/react'

import Tokens from '@/lib/tokens'
import {
  BandSection,
  Container,
  Eyebrow,
  DisplayTitle,
  Lead,
  PrimaryCta,
  SecondaryCta,
  CtaRow,
  SectionHeader,
  MonoLabel,
} from '@/styles/editorial'
import { SITE_DOMAIN } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Book a chat | Jason Rundell',
  description:
    'Book a chat with Jason Rundell about full-time leadership, fractional engineering leadership, or selective hands-on work.',
  alternates: { canonical: `${SITE_DOMAIN}/contact` },
}

export const revalidate = 86400

const bp = `${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}`

const ModesGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 2.5rem;

  @media (min-width: ${bp}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ModeTile = styled('div')`
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfaceSecondary.var};
  padding: 1.75rem;

  h3 {
    font-family: ${Tokens.fonts.heading.var};
    font-size: 1.25rem;
    margin: 0.75rem 0 0.5rem;
    color: ${Tokens.colors.ink.var};
  }

  p {
    margin: 0;
    color: ${Tokens.colors.inkMuted.var};
    font-size: 0.9375rem;
  }
`

const MODES = [
  {
    label: 'Mode 01',
    title: 'Full-time leadership',
    blurb:
      'Director / SDM / Head of Engineering roles, remote-first in Canada.',
  },
  {
    label: 'Mode 02',
    title: 'Fractional CTO / VP Eng',
    blurb:
      'Part-time platform and team leadership for founders at inflection points.',
  },
  {
    label: 'Mode 03',
    title: 'Selective hands-on builds',
    blurb:
      'Principal/staff-style work via Infinite Source Agency (US/UK contract).',
  },
] as const

export default function ContactPage() {
  return (
    <>
      <BandSection tone="paper">
        <Container>
          <Eyebrow label="Contact" />
          <DisplayTitle>Book a chat</DisplayTitle>
          <Lead>
            The fastest way to reach me is email, or grab a time on my calendar.
            Tell me where your team is and where you need it to go.
          </Lead>
          <CtaRow>
            <PrimaryCta href="https://calendly.com/jason-rundell/60-minute-meeting">
              Book time with me
            </PrimaryCta>
            <SecondaryCta href="mailto:contact@jasonrundell.com">
              contact@jasonrundell.com →
            </SecondaryCta>
          </CtaRow>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader
            eyebrow="Ways to work together"
            title="Three ways in"
            intro="Full-time and fractional leadership are co-primary; selective hands-on builds round it out."
          />
          <ModesGrid>
            {MODES.map((m) => (
              <ModeTile key={m.title}>
                <MonoLabel>{m.label}</MonoLabel>
                <h3>{m.title}</h3>
                <p>{m.blurb}</p>
              </ModeTile>
            ))}
          </ModesGrid>
        </Container>
      </BandSection>
    </>
  )
}

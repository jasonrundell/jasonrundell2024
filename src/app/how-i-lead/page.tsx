import React from 'react'
import { styled } from '@pigment-css/react'
import type { Metadata } from 'next'

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
import { LoopIllustration } from '@/components/illustrations/LineArt'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'How I lead | Jason Rundell',
  description:
    'How Jason Rundell leads engineering teams - an operating loop of assess, set standards, build the system, and coach the team, applied at inflection points.',
  path: '/how-i-lead',
})

const bp = `${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}`

const HeroGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: ${bp}) {
    grid-template-columns: 1.05fr 0.95fr;
    gap: 4rem;
  }
`

const HeroArt = styled('div')`
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
`

const StepList = styled('ol')`
  list-style: none;
  counter-reset: step;
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
`

const StepItem = styled('li')`
  counter-increment: step;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};

  &::before {
    content: counter(step, decimal-leading-zero);
    font-family: ${Tokens.fonts.monospace.var};
    font-size: 0.875rem;
    color: ${Tokens.colors.brass.var};
    padding-top: 0.3rem;
  }

  h2 {
    font-family: ${Tokens.fonts.heading.var};
    font-size: 1.5rem;
    margin: 0 0 0.4rem;
    color: ${Tokens.colors.ink.var};
  }

  p {
    margin: 0;
    color: ${Tokens.colors.inkMuted.var};
    max-width: 56ch;
  }
`

const PrincipleGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 2.5rem;

  @media (min-width: 40rem) {
    grid-template-columns: 1fr 1fr;
  }
`

const PrincipleCard = styled('div')`
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfacePrimary.var};
  padding: 1.75rem;

  h3 {
    font-family: ${Tokens.fonts.heading.var};
    font-size: 1.25rem;
    margin: 0.6rem 0 0.5rem;
    color: ${Tokens.colors.ink.var};
  }

  p {
    margin: 0;
    color: ${Tokens.colors.inkMuted.var};
    font-size: 0.9375rem;
  }
`

const StageFit = styled('p')`
  font-family: ${Tokens.fonts.quotes.var};
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  line-height: 1.4;
  color: ${Tokens.colors.ink.var};
  max-width: 30ch;
  margin: 0;
`

const STEPS = [
  {
    title: 'Assess',
    blurb:
      'Find where chaos needs order and order needs questioning. Understand the system, the team, and the constraints before changing anything.',
  },
  {
    title: 'Set standards',
    blurb:
      'Make quality, delivery, and expectations explicit - from code review and testing to how decisions get made.',
  },
  {
    title: 'Build the system',
    blurb:
      'Stand up the CI/CD, metrics, and rituals that let the team ship with confidence and scale beyond any one person.',
  },
  {
    title: 'Coach the team',
    blurb:
      'Grow people to run and improve the system themselves - including adopting AI with real governance, not hype.',
  },
] as const

const PRINCIPLES = [
  {
    label: 'Principle 01',
    title: 'Player-coach',
    blurb:
      'Lead from the front and stay close enough to the code to make sound technical calls.',
  },
  {
    label: 'Principle 02',
    title: 'Improver, not maintainer',
    blurb:
      'Join at inflection points and leave every team stronger than I found it.',
  },
  {
    label: 'Principle 03',
    title: 'AI with governance',
    blurb:
      'Adopt agentic development with policy, training, and guardrails - measured, not hyped.',
  },
  {
    label: 'Principle 04',
    title: 'Transparency by default',
    blurb:
      'Give leadership real visibility with metrics and honest reporting on the health of the work.',
  },
] as const

export default function HowILeadPage() {
  return (
    <>
      <BandSection tone="paper">
        <Container>
          <HeroGrid>
            <div>
              <Eyebrow label="How I lead" />
              <DisplayTitle>An operating loop, not a job title</DisplayTitle>
              <Lead>
                Leadership isn&rsquo;t a rank - it&rsquo;s a repeatable loop I
                run at every engagement: assess, set standards, build the
                system, then coach the team to run and improve it.
              </Lead>
              <CtaRow>
                <PrimaryCta href="/contact">Book a chat</PrimaryCta>
                <SecondaryCta href="/projects">See the work →</SecondaryCta>
              </CtaRow>
            </div>
            <HeroArt>
              <LoopIllustration />
            </HeroArt>
          </HeroGrid>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader
            eyebrow="The loop"
            title="Four moves, repeated"
            intro="The same sequence whether I'm running a full-time org or a fractional engagement."
          />
          <StepList>
            {STEPS.map((s) => (
              <StepItem key={s.title}>
                <div>
                  <h2>{s.title}</h2>
                  <p>{s.blurb}</p>
                </div>
              </StepItem>
            ))}
          </StepList>
        </Container>
      </BandSection>

      <BandSection tone="paper">
        <Container>
          <SectionHeader eyebrow="Stage fit" title="Where I do my best work" />
          <div style={{ marginTop: '1.5rem' }}>
            <StageFit>
              Thrive where chaos needs order, and order needs questioning. Best
              fit: Series A–C and assess-and-improve mandates.
            </StageFit>
          </div>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader eyebrow="Principles" title="What I lead by" />
          <PrincipleGrid>
            {PRINCIPLES.map((p) => (
              <PrincipleCard key={p.title}>
                <MonoLabel>{p.label}</MonoLabel>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
              </PrincipleCard>
            ))}
          </PrincipleGrid>
          <CtaRow>
            <PrimaryCta href="/contact">Book a chat</PrimaryCta>
          </CtaRow>
        </Container>
      </BandSection>
    </>
  )
}

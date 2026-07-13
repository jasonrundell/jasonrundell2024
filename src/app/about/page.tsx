import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { styled } from '@pigment-css/react'

import { getSkills, getReferences } from '@/lib/content'
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
} from '@/styles/editorial'
import { StyledBody } from '@/styles/common'
import Skills from '@/components/Skills'
import References from '@/components/References'
import { buildPersonJsonLd } from '@/lib/jsonld'
import { SITE_DOMAIN } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About | Jason Rundell',
  description:
    'About Jason Rundell - an engineering leader and player-coach with 25+ years in full-stack web development, skills, and recommendations.',
  alternates: { canonical: `${SITE_DOMAIN}/about` },
}

export const revalidate = 86400

const personJsonLd = buildPersonJsonLd()

const FactsGrid = styled('dl')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};

  @media (min-width: 40rem) {
    grid-template-columns: 1fr 1fr;
  }
`

const Fact = styled('div')`
  padding: 1.25rem 1.5rem 1.25rem 0;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};

  dt {
    font-family: ${Tokens.fonts.monospace.var};
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${Tokens.colors.accent.var};
    margin-bottom: 0.4rem;
  }

  dd {
    margin: 0;
    color: ${Tokens.colors.ink.var};
    font-size: 1rem;
  }
`

const FACTS = [
  { term: 'Based', detail: 'Canada (Eastern) · remote-first' },
  { term: 'Experience', detail: '25+ years, full-stack + leadership' },
  {
    term: 'Domains',
    detail: 'MarTech · FinTech · AI tooling · multi-tenant SaaS',
  },
  { term: 'Teams led', detail: 'Remote-first teams up to ~12 engineers' },
]

export default async function AboutPage() {
  const [skills, references] = await Promise.all([getSkills(), getReferences()])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <BandSection tone="paper">
        <Container>
          <Eyebrow label="About" />
          <DisplayTitle>An improver, not a maintainer</DisplayTitle>
          <Lead>
            I&rsquo;m an engineering leader with 25+ years in full-stack web
            development. I join at inflection points and build the systems,
            culture, and standards that let teams scale - while staying close
            enough to the code to raise the bar.
          </Lead>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader eyebrow="The story" title="How I work" />
          <div style={{ marginTop: '1.5rem' }}>
            <StyledBody>
              <p>
                The work follows a pattern: I walk into an organization,
                identify what&rsquo;s slowing it down, and build the fix.
                That&rsquo;s looked like establishing AI governance for
                enterprise tooling adoption, architecting QA platforms from
                zero, launching unit-testing cultures where none existed, and
                building multi-tenant SaaS infrastructure that turns weeks-long
                launches into days.
              </p>
              <p>
                I&rsquo;ve scaled engineering teams through hypergrowth, guided
                orgs through acquisitions, and cut release defect rates by
                introducing end-to-end ownership of the delivery pipeline. I run{' '}
                <Link
                  href="https://infinitesource.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Infinite Source
                </Link>
                , where I take on fractional leadership and architecture
                engagements for startups and scale-ups in MarTech, FinTech, and
                AI tooling.
              </p>
              <p>
                My journey started in a high-school library in 1997 discovering
                GeoCities. Since then I&rsquo;ve shipped work across every era
                of the web - from iframes and Flash to React design systems,
                Jamstack, and now agentic AI. The common thread isn&rsquo;t a
                stack; it&rsquo;s an instinct to find what&rsquo;s broken or
                inefficient and build something better.
              </p>
            </StyledBody>
          </div>
        </Container>
      </BandSection>

      <BandSection tone="paper">
        <Container>
          <SectionHeader eyebrow="At a glance" title="The facts" />
          <div style={{ marginTop: '2rem' }}>
            <FactsGrid>
              {FACTS.map((f) => (
                <Fact key={f.term}>
                  <dt>{f.term}</dt>
                  <dd>{f.detail}</dd>
                </Fact>
              ))}
            </FactsGrid>
          </div>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader
            eyebrow="Capabilities"
            title="What I work in"
            intro="A working map of the tools and disciplines I lead and build with."
          />
          <div style={{ marginTop: '2rem' }}>
            <Skills skills={skills} />
          </div>
        </Container>
      </BandSection>

      <BandSection tone="paper">
        <Container>
          <SectionHeader
            eyebrow="Recommendations"
            title="What colleagues say"
          />
          <div style={{ marginTop: '2rem' }}>
            {references.length > 0 && <References references={references} />}
          </div>
          <CtaRow>
            <PrimaryCta href="/contact">Book a chat</PrimaryCta>
            <SecondaryCta href="/how-i-lead">How I lead →</SecondaryCta>
          </CtaRow>
        </Container>
      </BandSection>
    </>
  )
}

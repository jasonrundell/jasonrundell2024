import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import { MonoLabel } from '@/styles/editorial'
import { buildPersonJsonLd } from '@/lib/jsonld'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'About | Jason Rundell',
  description:
    'About Jason Rundell - an engineering leader and player-coach with 25+ years in full-stack web development, skills, and recommendations.',
  path: '/about',
})

export const revalidate = 86400

const personJsonLd = buildPersonJsonLd()

const bp = `${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}`

// Two-column intro: copy left, portrait right (mirrors the homepage B1 hero).
const AboutHeroGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: ${bp}) {
    grid-template-columns: 1.05fr 0.95fr;
    gap: 4rem;
  }
`

const AboutHeroArt = styled('div')`
  order: -1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${bp}) {
    order: 1;
    max-width: none;
  }
`

// Story band: candid photo alongside the narrative.
const StoryGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;

  @media (min-width: ${bp}) {
    grid-template-columns: 0.8fr 1.2fr;
    gap: 4rem;
  }
`

const StoryArt = styled('div')`
  max-width: 360px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${bp}) {
    max-width: none;
    position: sticky;
    top: 2rem;
  }
`

// Shared portrait primitive: natural colour, hairline frame, sharp corners,
// caption in normal flow (style-guide Imagery → Portraiture).
const PortraitFrame = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfaceSecondary.var};
`

const PortraitCaption = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: 0.75rem;
`

const NameSignal = styled('span')`
  font-family: ${Tokens.fonts.heading.var};
  font-weight: 600;
  font-size: 1.05rem;
  color: ${Tokens.colors.ink.var};
`

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

      {/*
        Illustrated-portrait filter: posterizes the photo into flat tonal
        bands and lays ink edge-lines over it, so the About hero reads as a
        drawn portrait in the site's continuous-line idiom while staying a
        real likeness. Applied only to the About hero image.
      */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0 }}
      >
        <filter
          id="illustrated-portrait"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="smooth" />
          <feColorMatrix in="smooth" type="saturate" values="0.22" result="desat" />
          <feComponentTransfer in="desat" result="poster">
            <feFuncR type="discrete" tableValues="0.09 0.30 0.52 0.74 0.94" />
            <feFuncG type="discrete" tableValues="0.11 0.32 0.54 0.75 0.95" />
            <feFuncB type="discrete" tableValues="0.12 0.33 0.55 0.76 0.96" />
          </feComponentTransfer>
          <feColorMatrix
            in="smooth"
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
            result="gray"
          />
          <feConvolveMatrix
            in="gray"
            order="3"
            preserveAlpha="true"
            kernelMatrix="0 -1 0  -1 4 -1  0 -1 0"
            result="edgeRaw"
          />
          <feComponentTransfer in="edgeRaw" result="edgeBoost">
            <feFuncR type="linear" slope="2.2" />
            <feFuncG type="linear" slope="2.2" />
            <feFuncB type="linear" slope="2.2" />
          </feComponentTransfer>
          <feColorMatrix
            in="edgeBoost"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.5 0.5 0.5 0 0"
            result="inkAlpha"
          />
          <feFlood floodColor="#2E3338" result="inkColor" />
          <feComposite in="inkColor" in2="inkAlpha" operator="in" result="ink" />
          <feMerge>
            <feMergeNode in="poster" />
            <feMergeNode in="ink" />
          </feMerge>
        </filter>
      </svg>

      <BandSection tone="paper">
        <Container>
          <AboutHeroGrid>
            <div>
              <Eyebrow label="About" />
              <DisplayTitle>An improver, not a maintainer</DisplayTitle>
              <Lead>
                I&rsquo;m an engineering leader with 25+ years in full-stack web
                development. I join at inflection points and build the systems,
                culture, and standards that let teams scale - while staying
                close enough to the code to raise the bar.
              </Lead>
            </div>
            <AboutHeroArt>
              <PortraitFrame>
                <Image
                  src="/images/jasonrundell-about-2026.jpg"
                  alt="Jason Rundell"
                  fill
                  priority
                  sizes="(min-width: 64rem) 38vw, (min-width: 48rem) 90vw, 100vw"
                  style={{
                    objectFit: 'cover',
                    objectPosition: '50% 20%',
                    filter: 'url(#illustrated-portrait)',
                  }}
                />
              </PortraitFrame>
              <PortraitCaption>
                <NameSignal>Jason Rundell</NameSignal>
                <MonoLabel>Canada · remote-first</MonoLabel>
              </PortraitCaption>
            </AboutHeroArt>
          </AboutHeroGrid>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <SectionHeader eyebrow="The story" title="How I work" />
          <div style={{ marginTop: '1.5rem' }}>
            <StoryGrid>
              <StoryArt>
                <PortraitFrame>
                  <Image
                    src="/images/jasonrundell-candid-2026.jpg"
                    alt="Jason Rundell"
                    fill
                    sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 90vw, 100vw"
                    style={{ objectFit: 'cover', objectPosition: '50% 22%' }}
                  />
                </PortraitFrame>
                <PortraitCaption>
                  <MonoLabel>Player-coach · still shipping</MonoLabel>
                </PortraitCaption>
              </StoryArt>
              <StyledBody>
                <p>
                  The work follows a pattern: I walk into an organization,
                  identify what&rsquo;s slowing it down, and build the fix.
                  That&rsquo;s looked like establishing AI governance for
                  enterprise tooling adoption, architecting QA platforms from
                  zero, launching unit-testing cultures where none existed, and
                  building multi-tenant SaaS infrastructure that turns
                  weeks-long launches into days.
                </p>
                <p>
                  I&rsquo;ve scaled engineering teams through hypergrowth,
                  guided orgs through acquisitions, and cut release defect rates
                  by introducing end-to-end ownership of the delivery pipeline.
                  I run{' '}
                  <Link
                    href="https://infinitesource.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Infinite Source
                  </Link>
                  , where I take on fractional leadership and architecture
                  engagements for startups and scale-ups in MarTech, FinTech,
                  and AI tooling.
                </p>
                <p>
                  My journey started in a high-school library in 1997
                  discovering GeoCities. Since then I&rsquo;ve shipped work
                  across every era of the web - from iframes and Flash to React
                  design systems, Jamstack, and now agentic AI. The common
                  thread isn&rsquo;t a stack; it&rsquo;s an instinct to find
                  what&rsquo;s broken or inefficient and build something better.
                </p>
              </StyledBody>
            </StoryGrid>
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

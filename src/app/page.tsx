import React from 'react'
import { styled } from '@pigment-css/react'

import { getFeaturedProjects, getLatestPosts } from '@/lib/content'
import { toProjectCardItem } from '@/lib/projectUtils'
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
import MorePosts from '@/components/MorePosts'
import MoreProjects from '@/components/MoreProjects'
import InfiniteSourcePromo from '@/components/InfiniteSourcePromo'
import {
  HeroIllustration,
  LoopIllustration,
  BranchIllustration,
} from '@/components/illustrations/LineArt'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

const HOMEPAGE_PROJECT_LIMIT = 3
const HOMEPAGE_POST_LIMIT = 3

export const metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

export const revalidate = 86400

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
  order: -1;
  max-width: 460px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${bp}) {
    order: 1;
    max-width: none;
  }
`

const ProofGrid = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-top: 2.5rem;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};

  @media (min-width: 40rem) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${bp}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const ProofCell = styled('div')`
  padding: 1.5rem 1.5rem 1.5rem 0;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};

  @media (min-width: ${bp}) {
    padding: 1.75rem 1.5rem 0 0;
    border-bottom: none;
  }
`

const ProofValue = styled('div')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
  margin: 0 0 0.35rem;
  line-height: 1.1;
`

const TwoCol = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: ${bp}) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`

const Art = styled('div')`
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
`

const CaseList = styled('ol')`
  list-style: none;
  counter-reset: case;
  margin: 2.5rem 0 0;
  padding: 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
`

const CaseItem = styled('li')`
  counter-increment: case;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};

  &::before {
    content: counter(case, decimal-leading-zero);
    font-family: ${Tokens.fonts.monospace.var};
    font-size: 0.8125rem;
    color: ${Tokens.colors.accent.var};
    padding-top: 0.35rem;
  }

  h3 {
    font-family: ${Tokens.fonts.heading.var};
    font-size: 1.375rem;
    margin: 0 0 0.25rem;
    color: ${Tokens.colors.ink.var};
  }

  p {
    margin: 0;
    color: ${Tokens.colors.inkMuted.var};
  }
`

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
  background-color: ${Tokens.colors.surfacePrimary.var};
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

const SectionFoot = styled('div')`
  margin-top: 2rem;
`

const PROOF = [
  { value: '~60%', label: 'fewer post-release bugs · CMI' },
  { value: '~50%', label: 'faster deploys · Bitbuy' },
  { value: 'Up to 12', label: 'engineers led · Bitbuy' },
  { value: '$206M', label: 'acquisition support · WonderFi' },
] as const

const CASES = [
  {
    title: 'CMI - scaled the org, tightened the system',
    blurb:
      'Grew the team 4→10, reformed deployment, and stood up engineering metrics that gave leadership real visibility.',
  },
  {
    title: 'Bitbuy - fewer bugs, faster ships',
    blurb:
      'Built end-to-end testing and CI/CD that cut post-release bugs and sped up deployments and renders.',
  },
  {
    title: 'Bitbuy → WonderFi - stability through a $206M acquisition',
    blurb:
      'Kept the platform stable and the team steady through a major acquisition and integration.',
  },
] as const

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

export default async function HomePage() {
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(HOMEPAGE_PROJECT_LIMIT),
    getLatestPosts(HOMEPAGE_POST_LIMIT),
  ])

  return (
    <>
      {/* Hero */}
      <BandSection tone="paper">
        <Container>
          <HeroGrid>
            <div>
              <Eyebrow label="Engineering Leader · Player-Coach" />
              <DisplayTitle>
                Lead engineering orgs. Raise the technical bar.
              </DisplayTitle>
              <Lead>
                I join at inflection points and build the systems, culture, and
                standards that let teams scale - while staying close enough to
                the code to raise the bar.
              </Lead>
              <CtaRow>
                <PrimaryCta href="/contact">Book a chat</PrimaryCta>
                <SecondaryCta href="/projects">
                  View selected work →
                </SecondaryCta>
              </CtaRow>
            </div>
            <HeroArt>
              <HeroIllustration />
            </HeroArt>
          </HeroGrid>
        </Container>
      </BandSection>

      {/* Outcomes / proof */}
      <BandSection tone="surface">
        <Container>
          <SectionHeader
            eyebrow="Outcomes"
            title="Proof, not posturing"
            intro="Selected, labeled results from teams I've led - kept honest about where each came from."
          />
          <ProofGrid>
            {PROOF.map((p) => (
              <ProofCell key={p.label}>
                <ProofValue>{p.value}</ProofValue>
                <MonoLabel>{p.label}</MonoLabel>
              </ProofCell>
            ))}
          </ProofGrid>
        </Container>
      </BandSection>

      {/* How I lead - operating loop teaser */}
      <BandSection tone="paper">
        <Container>
          <TwoCol>
            <div>
              <SectionHeader
                eyebrow="How I lead"
                title="An operating loop, not a job title"
                intro="Assess, set standards, build the system, then coach the team to run it - and question the order when it stops serving the work."
              />
              <SectionFoot>
                <SecondaryCta href="/how-i-lead">See how I lead →</SecondaryCta>
              </SectionFoot>
            </div>
            <Art>
              <LoopIllustration />
            </Art>
          </TwoCol>
        </Container>
      </BandSection>

      {/* Selected work - cases + projects */}
      <BandSection tone="surface">
        <Container>
          <TwoCol>
            <div>
              <SectionHeader
                eyebrow="Selected work"
                title="Moving the needle"
              />
              <CaseList>
                {CASES.map((c) => (
                  <CaseItem key={c.title}>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.blurb}</p>
                    </div>
                  </CaseItem>
                ))}
              </CaseList>
              <SectionFoot>
                <SecondaryCta href="/projects">
                  All selected work →
                </SecondaryCta>
              </SectionFoot>
            </div>
            <Art>
              <BranchIllustration />
            </Art>
          </TwoCol>
        </Container>
      </BandSection>

      {/* Featured projects */}
      <BandSection tone="paper">
        <Container>
          <SectionHeader eyebrow="Projects" title="Recent builds" />
          <div style={{ marginTop: '2rem' }}>
            <MoreProjects items={featuredProjects.map(toProjectCardItem)} />
          </div>
        </Container>
      </BandSection>

      {/* Infinite Source */}
      <BandSection tone="surface">
        <Container>
          <InfiniteSourcePromo />
        </Container>
      </BandSection>

      {/* Ways to work */}
      <BandSection tone="paper">
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
          <CtaRow>
            <PrimaryCta href="/contact">Book a chat</PrimaryCta>
          </CtaRow>
        </Container>
      </BandSection>

      {/* Writing */}
      <BandSection tone="surface">
        <Container>
          <SectionHeader eyebrow="Writing" title="Latest posts" />
          <div style={{ marginTop: '2rem' }}>
            <MorePosts posts={latestPosts} />
          </div>
          <SectionFoot>
            <SecondaryCta href="/posts">All writing →</SecondaryCta>
          </SectionFoot>
        </Container>
      </BandSection>
    </>
  )
}

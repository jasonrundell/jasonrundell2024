import React from 'react'
import Link from 'next/link'
import { Row } from '@jasonrundell/dropship'

import { getSkills, getReferences, getPositions } from '@/lib/content'

import {
  StyledContainer,
  StyledIntroParagraph,
  StyledSection,
  StyledBreadcrumb,
  StyledLink,
} from '@/styles/common'

import Skills from '@/components/Skills'
import References from '@/components/References'
import { SectionHeading } from '@/components/chrome'
import { buildPersonJsonLd } from '@/lib/jsonld'

export const metadata = {
  title: 'About | Jason Rundell',
  description:
    'About Jason Rundell — manager, full-stack developer, skills, experience, and recommendations.',
}

export const revalidate = 86400

const personJsonLd = buildPersonJsonLd()

export default async function AboutPage() {
  const [skills, references] = await Promise.all([
    getSkills(),
    getReferences(),
    getPositions(),
  ])

  return (
    <StyledContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <StyledSection id="about">
        <StyledBreadcrumb>
          <Link href="/">Home</Link> &gt; About
        </StyledBreadcrumb>
        <h1>About Jason Rundell</h1>
        <Row>
          <StyledIntroParagraph>
            I&apos;m an engineering leader and full-stack architect who joins
            organizations at inflection points — where chaos needs order, and
            order needs questioning. Over 20+ years I&apos;ve scaled teams,
            modernized platforms, and built the systems and standards that let
            engineering orgs ship with confidence.
          </StyledIntroParagraph>
          <p>
            The work follows a pattern: I walk into an organization, identify
            what&apos;s slowing them down, and build the fix. That&apos;s looked
            like establishing AI governance frameworks for enterprise tooling
            adoption, architecting QA platforms from zero, launching
            unit-testing cultures where none existed, and building multi-tenant
            SaaS infrastructure that turns weeks-long product launches into
            days. I&apos;ve scaled engineering teams through hypergrowth, guided
            orgs through acquisitions, and cut release defect rates by
            introducing end-to-end ownership of the delivery pipeline.
          </p>
          <p>
            I run{' '}
            <StyledLink
              href="https://infinitesource.agency"
              className="link"
              target="_blank"
            >
              Infinite Source
            </StyledLink>
            , where I take on fractional leadership and architecture engagements
            — helping startups and scale-ups in MarTech, FinTech, and AI tooling
            establish the engineering culture, delivery pipelines, and quality
            gates they need to grow. I also build production software:
            AI-powered tools, headless commerce platforms, and developer
            experience infrastructure.
          </p>
          <p>
            My journey started in a high school library in 1997 discovering
            GeoCities. Since then I&apos;ve shipped work across every era of the
            web — iframes, Flash, jQuery Mobile, WordPress multisites, React
            design systems, Jamstack, and now agentic AI. The common thread
            isn&apos;t a stack — it&apos;s an instinct to find what&apos;s
            broken or inefficient and build something better.
          </p>
          <p>
            I&apos;m not a status-quo maintainer. I&apos;m an improver. If your
            team is at an inflection point and needs someone who asks
            &quot;why&quot; before building &quot;what,&quot; let&apos;s talk.
          </p>
        </Row>
      </StyledSection>

      <StyledSection id="skills">
        <SectionHeading comment="skills.tsx">Skills</SectionHeading>
        <Row>{skills && <Skills skills={skills} />}</Row>
      </StyledSection>

      <StyledSection id="recommendations">
        <SectionHeading comment="recommendations.tsx">
          Recommendations
        </SectionHeading>
        <Row>
          {references.length > 0 && <References references={references} />}
        </Row>
      </StyledSection>
    </StyledContainer>
  )
}

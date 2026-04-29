import React from 'react'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Row, Spacer } from '@jasonrundell/dropship'

import {
  getSkills,
  getReferences,
  getPositions,
} from '@/lib/contentful'

import {
  StyledContainer,
  StyledIntroParagraph,
  StyledSection,
  StyledLink,
  StyledBreadcrumb,
} from '@/styles/common'

import Skills from '@/components/Skills'
import References from '@/components/References'
import Positions from '@/components/Positions'
import Icon from '@/components/Icon'
import { SectionHeading, PromptList } from '@/components/chrome'
import { buildPersonJsonLd } from '@/lib/jsonld'

export const metadata = {
  title: 'About | Jason Rundell',
  description:
    'About Jason Rundell — manager, full-stack developer, skills, experience, and recommendations.',
}

export const revalidate = 86400

const personJsonLd = buildPersonJsonLd()

export default async function AboutPage() {
  const [skills, references, positions] = await Promise.all([
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
            Hi! I&apos;m an AI-first Application Development Manager and Senior
            Full Stack Web Developer with 20+ years leading high-impact web
            platforms and engineering teams. Skilled at modernizing legacy
            systems into scalable web applications, integrating AI into
            workflows and products, and aligning delivery with business goals.
          </StyledIntroParagraph>
          <p>
            My passion for creating web experiences began in my high
            school&apos;s library back in 1997 when I discovered GeoCities.
            Since then, I&apos;ve been fortunate to work on a diverse range of
            projects spanning multiple technologies, including iframes, Flash,
            WordPress multisites, jQuery Mobile, custom CMS applications, a
            Facebook contest platform, React design systems, Jamstack
            architecture, and most recently, exploration of the possibilities
            and limitations of automation, and AI.
          </p>
          <p>
            I&apos;m constantly exploring new trends and experimenting with
            emerging technologies in my spare time to expand my skills and
            knowledge. As a lifelong learner, I embrace change, seek out
            challenges, and thrive on the fast-paced nature of the tech
            industry. After 20 years, I still love working on the web!
          </p>
        </Row>
      </StyledSection>

      <StyledSection id="skills">
        <SectionHeading comment="skills.tsx">Skills</SectionHeading>
        <Row>{skills && <Skills skills={skills} />}</Row>
      </StyledSection>

      <StyledSection id="experience">
        <SectionHeading comment="experience.tsx">Experience</SectionHeading>
        <Row>
          {positions.length > 0 && <Positions positions={positions} />}
        </Row>
        <Spacer />
        <Row>
          <PromptList aria-label="More experience links">
            <PromptList.Item>
              <Icon type="LinkedIn" />{' '}
              <StyledLink
                href="https://www.linkedin.com/in/jasonrundell/"
                rel="noopener noreferrer"
                target="_blank"
                aria-label="See more on LinkedIn"
              >
                <ExternalLink size={18} /> See more on LinkedIn
              </StyledLink>
            </PromptList.Item>
          </PromptList>
        </Row>
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

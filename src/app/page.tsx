import React from 'react'
import Image from 'next/image'
import { Row, Spacer, Grid } from '@jasonrundell/dropship'

import { getFeaturedProjects, getLastSong, getLatestPosts } from '@/lib/content'
import { toProjectCardItem } from '@/lib/projectUtils'

import {
  StyledDivBgDark,
  StyledIntroParagraph,
  StyledContainer,
  StyledSection,
  StyledImageContainer,
} from '@/styles/common'

import MorePosts from '@/components/MorePosts'
import MoreProjects from '@/components/MoreProjects'
import HeroTerminal, { type HeroConstField } from '@/components/HeroTerminal'
import HubDoors, { type HubDoor } from '@/components/HubDoors'
import LastSong from '@/components/LastSong'
import { SectionHeading } from '@/components/chrome'
import { Reveal } from '@/styles/motion'
import HeroImage from '@/public/images/ai-powered-developer.webp'

const imageCoverStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'center',
}

const HUB_DOORS: ReadonlyArray<HubDoor> = [
  {
    href: '/about',
    label: 'About',
    description: 'Background, skills, and what I bring to the table.',
  },
  {
    href: '/projects',
    label: 'Projects',
    description: 'A complete index of shipped and side projects.',
  },
  {
    href: '/posts',
    label: 'Blog',
    description: 'Notes on the web, engineering, and AI-assisted work.',
  },
] as const

const HERO_HEADING = 'Engineering Leader / Full-Stack Architect'

const HERO_PITCH =
  "I'm an engineering leader and full-stack architect who joins organizations at inflection points — where chaos needs order, and order needs questioning."

const HERO_FIELDS: ReadonlyArray<HeroConstField> = [
  { key: 'name', value: 'Jason Rundell' },
  { key: 'role', value: 'Engineering Leader / Full-Stack Architect' },
  {
    key: 'pitch',
    value:
      '20+ years scaling teams, modernizing platforms, and building the systems that let engineering orgs ship with confidence.',
  },
] as const

const HOMEPAGE_PROJECT_LIMIT = 3
const HOMEPAGE_POST_LIMIT = 3

export const metadata = {
  title: 'Engineering Leader / Full-Stack Architect | Jason Rundell',
  description:
    'Jason Rundell — engineering leader and full-stack architect. 20+ years scaling teams, modernizing platforms, and shipping with confidence.',
}

export const revalidate = 86400

export default async function HomePage() {
  const [featuredProjects, posts, lastSong] = await Promise.all([
    getFeaturedProjects(HOMEPAGE_PROJECT_LIMIT),
    getLatestPosts(HOMEPAGE_POST_LIMIT),
    getLastSong(),
  ])

  const latestPosts = [...posts]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, HOMEPAGE_POST_LIMIT)

  return (
    <>
      <StyledContainer>
        <StyledSection id="home">
          <StyledImageContainer>
            <Image
              src={HeroImage}
              alt="AI-powered developer"
              fill={true}
              style={imageCoverStyle}
              priority
              quality={90}
              sizes="100vw"
            />
          </StyledImageContainer>
          <Spacer />
          <HeroTerminal
            fields={HERO_FIELDS}
            heading={HERO_HEADING}
            pitch={HERO_PITCH}
          />
          <Spacer />
          <Grid
            gridTemplateColumns="1fr"
            largeTemplateColumns="2fr 1fr"
            columnGap="2rem"
          >
            <Row>
              <StyledIntroParagraph>
                I&apos;m an engineering leader and full-stack architect who
                joins organizations at inflection points — where chaos needs
                order, and order needs questioning.
              </StyledIntroParagraph>
              <p>
                Looking for the long version, my work, or my writing? Pick a
                door.
              </p>
            </Row>
            <Row>{lastSong && <LastSong song={lastSong} />}</Row>
          </Grid>
          <Spacer />
          <Reveal>
            <HubDoors doors={HUB_DOORS} ariaLabel="Site sections" />
          </Reveal>
        </StyledSection>

        <StyledSection id="latest-projects">
          <SectionHeading comment="latest-projects.tsx">
            Latest Projects
          </SectionHeading>
          <Row>
            <MoreProjects items={featuredProjects.map(toProjectCardItem)} />
          </Row>
        </StyledSection>
      </StyledContainer>

      <StyledDivBgDark>
        <StyledContainer>
          <StyledSection id="latest-posts">
            <Spacer />
            <SectionHeading comment="latest-posts.tsx">
              Latest posts
            </SectionHeading>
            <Spacer />
            <Row>
              <MorePosts posts={latestPosts} />
            </Row>
          </StyledSection>
        </StyledContainer>
      </StyledDivBgDark>
    </>
  )
}

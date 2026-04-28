import React from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Row, Spacer, Grid } from '@jasonrundell/dropship'

import { getProjects, getPosts } from '@/lib/contentful'
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
import HubDoors, { HubDoor } from '@/components/HubDoors'
import HeroImage from '@/public/images/ai-powered-developer.webp'

const LastSongWrapper = dynamic(() => import('@/components/LastSongWrapper'), {
  loading: () => <div>Loading...</div>,
})

const imageCoverStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'center',
}

const HUB_DOORS: ReadonlyArray<HubDoor> = [
  {
    href: '/about',
    label: 'About',
    description: 'Bio, skills, experience, and recommendations.',
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

const HOMEPAGE_PROJECT_LIMIT = 3
const HOMEPAGE_POST_LIMIT = 3

export const metadata = {
  title: 'Manager / Full Stack Developer | Jason Rundell',
  description:
    'Jason Rundell — AI-first Application Development Manager and Senior Full Stack Web Developer.',
}

export const revalidate = 86400

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])

  const selectedProjects = [...projects]
    .sort((a, b) => {
      const orderA =
        typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
      const orderB =
        typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
    .slice(0, HOMEPAGE_PROJECT_LIMIT)

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
          <h1>Manager / Full Stack Developer</h1>
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
          <Grid
            gridTemplateColumns="1fr"
            largeTemplateColumns="2fr 1fr"
            columnGap="2rem"
          >
            <Row>
              <StyledIntroParagraph>
                Hi! I&apos;m an AI-first Application Development Manager and
                Senior Full Stack Web Developer with 20+ years leading
                high-impact web platforms and engineering teams.
              </StyledIntroParagraph>
              <p>
                Looking for the long version, my work, or my writing? Pick a
                door.
              </p>
            </Row>
            <Row>
              <LastSongWrapper />
            </Row>
          </Grid>
        </StyledSection>

        <StyledSection id="doors">
          <HubDoors doors={HUB_DOORS} />
        </StyledSection>

        <StyledSection id="selected-projects">
          <h2>Selected projects</h2>
          <Row>
            <MoreProjects items={selectedProjects.map(toProjectCardItem)} />
          </Row>
        </StyledSection>
      </StyledContainer>

      <StyledDivBgDark>
        <StyledContainer>
          <StyledSection id="latest-posts">
            <Spacer />
            <h2>Latest posts</h2>
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

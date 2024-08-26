import React from 'react'
import Head from 'next/head'
import {
  Container,
  Section,
  Spacer,
  Row,
  Heading,
  Paragraph,
  Link,
} from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import MorePosts from '../components/more-posts'
import HeroPost from '../components/hero-post'
import Layout from '../components/Layout'
import Positions from '../components/Positions'
import References from '../components/References'
import Skills from '../components/Skills'
import { getAllPostsForHome } from '../lib/api/posts'
import { getAllSkillsForHome } from '../lib/api/skills'
import { getAllReferencesForHome } from '../lib/api/references'
import { getAllPositionsForHome } from '../lib/api/positions'
import { SITE_NAME } from '../lib/constants'
import { tokens } from '../data/tokens'

export default function Index({
  preview,
  allPosts,
  allSkills,
  allReferences,
  allPositions,
}) {
  const heroPost = allPosts[0]
  const posts = allPosts.slice(1)
  const skills = allSkills
  const references = allReferences
  const positions = allPositions

  const StyledDivBgDark = styled.div`
    background-color: ${tokens['--background-color-2']};
    padding-top: ${tokens['--size-section']};
  `

  const StyledDiv = styled.div`
    padding-top: ${tokens['--size-section']};
  `

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_NAME}</title>
        </Head>
        <Container>
          <StyledDiv id="home">
            <Section>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading label="Jason Rundell" classNames="font-bold" />
              </Row>
              <Row>
                <Heading
                  level={2}
                  label="Full Stack Web Developer &amp; Manager"
                />
              </Row>
              <Row>
                <Paragraph>
                  I&apos;m an experienced developer who loves learning and using
                  the latest in front end web development, but I also have a
                  wealth of experience and love for back end, dev ops, database
                  design, component driven design, design systems, and aligning
                  developer career growth with business goals as a manager or
                  tech lead.
                </Paragraph>
                <Paragraph>
                  My technical skill set includes experience with:
                </Paragraph>
                <Paragraph>
                  HTML, CSS, JavaScript, PHP, Node.js, React, Next.js, Cypress,
                  Storybook, LaunchDarkly, AWS, Docker, WordPress, Figma, Git,
                  Chromatic, Sentry, Google Tag Manager, Figma, Contentful,
                  Jira, MySQL, Amplify, Jenkins, CircleCI, Docker, GitHub,
                  Bitbucket.
                </Paragraph>
                <Heading
                  level={3}
                  label="After 20 years, I still love working on the web"
                />
                <Paragraph>
                  My passion for creating web experiences began in my high
                  school&apos;s library back in 1997 when I discovered
                  GeoCities. Since then, I&apos;ve been fortunate to work on a
                  diverse range of projects spanning multiple technologies,
                  including iframes, Flash, WordPress multisites, jQuery Mobile,
                  custom CMS applications, a Facebook contest platform, React
                  design systems, Jamstack architecture, and most recently,
                  exploration of the possibilities and limitations of
                  automation, AI and AGI (Artificial General Intelligence). I am
                  constantly exploring new trends and experimenting with
                  emerging technologies in my spare time to expand my skills and
                  knowledge. As a lifelong learner, I embrace change, seek out
                  challenges, and thrive on the fast-paced nature of the tech
                  industry.
                </Paragraph>
              </Row>
              <Row>
                <Paragraph>
                  🗓️{' '}
                  <Link
                    href="https://calendly.com/jason-rundell/60-minute-meeting"
                    label="Book time with me"
                  />
                </Paragraph>
              </Row>
              <Row>
                <Paragraph>
                  👀{' '}
                  <Link
                    href="https://github.com/jasonrundell?tab=repositories&q=&type=&language=&sort="
                    label="Check out my open-source work on GitHub"
                  />
                </Paragraph>
              </Row>
              <Spacer sizeLarge="largest" />
            </Section>
          </StyledDiv>
        </Container>

        <StyledDivBgDark id="latest-post">
          <Section>
            <Container>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading level={2} label="My latest blog post" />
              </Row>
              <Spacer sizeLarge="largest" />
              {heroPost && (
                <HeroPost
                  title={heroPost.title}
                  coverImage={heroPost.coverImage}
                  date={heroPost.date}
                  author={heroPost.author}
                  slug={heroPost.slug}
                  excerpt={heroPost.excerpt}
                />
              )}
              <Spacer sizeLarge="largest" />
            </Container>
          </Section>
        </StyledDivBgDark>

        <StyledDiv id="skills">
          <Section>
            <Container>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading level={2} label="Tools and technologies" />
              </Row>
              <Row>{skills.length > 0 && <Skills items={skills} />}</Row>
              <Spacer sizeLarge="largest" />
            </Container>
          </Section>
        </StyledDiv>

        <StyledDivBgDark id="experience">
          <Section>
            <Container>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading level={2} label="Experience" />
              </Row>
              <Row>
                {positions.length > 0 && <Positions positions={positions} />}
              </Row>
              <Spacer sizeLarge="largest" />
            </Container>
          </Section>
        </StyledDivBgDark>

        <StyledDiv id="references">
          <Section>
            <Container>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading level={2} label="References" />
              </Row>
              <Row>
                {references.length > 0 && (
                  <References references={references} />
                )}
              </Row>
              <Spacer sizeLarge="largest" />
            </Container>
          </Section>
        </StyledDiv>

        <StyledDivBgDark id="blog">
          <Section>
            <Container>
              <Spacer sizeLarge="largest" />
              <Row>
                <Heading level={2} label="Blog" />
              </Row>
              <Spacer sizeLarge="largest" />
              {posts.length > 0 && <MorePosts items={posts} />}
              <Spacer sizeLarge="largest" />
            </Container>
          </Section>
        </StyledDivBgDark>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = (await getAllPostsForHome(preview)) ?? []
  const allSkills = (await getAllSkillsForHome(preview)) ?? []
  const allReferences = (await getAllReferencesForHome(preview)) ?? []
  const allPositions = (await getAllPositionsForHome(preview)) ?? []
  return {
    props: { preview, allPosts, allSkills, allReferences, allPositions },
  }
}

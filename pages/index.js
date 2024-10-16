import React from 'react'
import Head from 'next/head'
import {
  Section,
  Spacer,
  Row,
  Heading,
  Paragraph,
  Link,
} from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import MorePosts from '../components/more-posts'
// import HeroPost from '../components/hero-post'
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
  // const heroPost = allPosts[0]
  const posts = allPosts.slice(0)
  const skills = allSkills
  const references = allReferences
  const positions = allPositions

  const StyledDiv = styled.div`
    padding-left: ${tokens['--size-section']};
    padding-right: ${tokens['--size-section']};
  `

  const StyledDivBgDark = styled.div`
    background-color: ${tokens['--background-color-2']};
    padding-top: ${tokens['--size-section']};
    padding-left: ${tokens['--size-section']};
    padding-right: ${tokens['--size-section']};
  `

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_NAME}</title>
        </Head>
        <div id="home" />
        <Spacer
          smallScreen="largest"
          mediumScreen="largest"
          largeScreen="largest"
        />
        <StyledDiv>
          <Section>
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:gap-x-16">
              <div>
                <Heading
                  level={2}
                  label="Jason Rundell"
                  classNames="font-bold"
                />
                <Heading level={3} label="Full Stack Web Developer" />
                <Row>
                  <Paragraph>
                    Hey! I&apos;m an experienced developer who loves learning
                    and using the latest in front end web development, but I
                    also have a wealth of experience and love for back end, dev
                    ops, database design, component driven design, design
                    systems, and leading with empathy as a manager or tech lead.
                  </Paragraph>
                  <Paragraph>
                    My passion for creating web experiences began in my high
                    school&apos;s library back in 1997 when I discovered
                    GeoCities. Since then, I&apos;ve been fortunate to work on a
                    diverse range of projects spanning multiple technologies,
                    including iframes, Flash, WordPress multisites, jQuery
                    Mobile, custom CMS applications, a Facebook contest
                    platform, React design systems, Jamstack architecture, and
                    most recently, exploration of the possibilities and
                    limitations of automation, AI and AGI (Artificial General
                    Intelligence). I am constantly exploring new trends and
                    experimenting with emerging technologies in my spare time to
                    expand my skills and knowledge. As a lifelong learner, I
                    embrace change, seek out challenges, and thrive on the
                    fast-paced nature of the tech industry. After 20 years, I
                    still love working on the web!
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
                <hr />
                <Heading level={3} label="Recommendations" />
                <Row>
                  {references.length > 0 && (
                    <References references={references} />
                  )}
                </Row>
                <hr />
              </div>
              <Row>{skills.length > 0 && <Skills items={skills} />}</Row>
            </div>
          </Section>
        </StyledDiv>

        <StyledDivBgDark id="blog">
          <Section>
            {/* <Row>
                <Heading level={2} label="My latest blog post" />
              </Row>
              {heroPost && (
                <Row>
                  <HeroPost
                    title={heroPost.title}
                    coverImage={heroPost.coverImage}
                    date={heroPost.date}
                    author={heroPost.author}
                    slug={heroPost.slug}
                    excerpt={heroPost.excerpt}
                  />
                </Row>
              )} */}
            <Row>
              <Heading level={2} label="Blog" />
            </Row>
            {posts.length > 0 && <MorePosts items={posts} />}
          </Section>
        </StyledDivBgDark>

        {/* <StyledDivBgDark>
          <Section>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={2} label="Experience" />
            </Row>
            <Row>
              {positions.length > 0 && <Positions positions={positions} />}
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
        </StyledDivBgDark>

        <StyledDiv id="references">
          <Section>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={2} label="References" />
            </Row>
            <Row>
              {references.length > 0 && <References references={references} />}
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
        </StyledDiv> */}
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

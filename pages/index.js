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

import MorePosts from '../components/more-posts'
import HeroPost from '../components/hero-post'
import Layout from '../components/layout'
import Skills from '../components/Skills'
import References from '../components/References'
import { getAllPostsForHome } from '../lib/api/posts'
import { getAllSkillsForHome } from '../lib/api/skills'
import { getAllReferencesForHome } from '../lib/api/references'
import { SITE_NAME } from '../lib/constants'

export default function Index({ preview, allPosts, allSkills, allReferences }) {
  const heroPost = allPosts[0]
  const posts = allPosts.slice(1)
  const skills = allSkills.slice(1)
  const references = allReferences.slice(1)

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_NAME}</title>
        </Head>
        <Container>
          <Section id="intro">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading label="Jason Rundell" classNames="font-bold" />
            </Row>
            <Row>
              <Heading
                level={2}
                label="Engineering Manager / Full Stack Web Developer"
              />
            </Row>
            <Row>
              <Paragraph>
                Hello. I&apos;m a developer who loves learning and using the
                latest in front end web development. My skill set includes
                experience with Docker, React, NextJS, Gatsby, Contentful, PHP,
                MySQL, SASS, CSS, HTML, JavaScript, and Amazon Web Services.
              </Paragraph>
              <Paragraph>
                My passion for creating web experiences began in my high
                school&apos;s library back in 1997 when I discovered GeoCities.
                Since then, I&apos;ve been fortunate to work on a diverse range
                of projects spanning multiple technologies, including iframes,
                Flash, WordPress multisites, jQuery Mobile, custom CMS
                applications, a Facebook contest platform, React design systems,
                Jamstack architecture, and most recently, exploration of the
                possibilities and limitations of AI and generative art. I am
                constantly exploring new trends and experimenting with emerging
                technologies in my spare time to expand my skills and knowledge.
                As a lifelong learner, I embrace change, seek out challenges,
                and thrive on the fast-paced nature of the tech industry.
              </Paragraph>
            </Row>
            <Row>
              <Paragraph>
                🗓️{' '}
                <Link
                  href="https://calendly.com/jason-rundell/30min"
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
        </Container>
        <Section id="tools-and-technologies" classNames="bg--dark">
          <Container>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="Tools and Technologies" />
            </Row>
            <Row>{skills.length > 0 && <Skills items={skills} />}</Row>
            <Spacer sizeLarge="largest" />
          </Container>
        </Section>
        <Section id="experience">
          <Container>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="Experience" />
            </Row>
            <Spacer sizeLarge="largest" />
          </Container>
        </Section>
        <Section id="references" classNames="bg--dark">
          <Container>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="References" />
            </Row>
            <Row>
              {references.length > 0 && <References references={references} />}
            </Row>
            <Spacer sizeLarge="largest" />
          </Container>
        </Section>
        <Section id="latest-post">
          <Container>
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="My latest post" />
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
            {posts.length > 0 && <MorePosts items={posts} />}
          </Container>
        </Section>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = (await getAllPostsForHome(preview)) ?? []
  const allSkills = (await getAllSkillsForHome(preview)) ?? []
  const allReferences = (await getAllReferencesForHome(preview)) ?? []
  return {
    props: { preview, allPosts, allSkills, allReferences },
  }
}

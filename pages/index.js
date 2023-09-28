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

import Container from '../components/container'
import MorePosts from '../components/more-posts'
import HeroPost from '../components/hero-post'
import Layout from '../components/layout'
import { getAllPostsForHome } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ preview, allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Section id="intro">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading label="Jason Rundell" classNames="font-bold" />
            </Row>
            <Row>
              <Heading level={2} label="Full Stack Web Developer" />
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
          <Section id="tools-and-technologies">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="Tools and Technologies" />
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
          <Section id="experience">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="Experience" />
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
          <Section id="references">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="References" />
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
          <Section id="latest-post">
            <Spacer sizeLarge="largest" />
            <Row>
              <Heading level={3} label="My latest post" />
            </Row>
            <Spacer sizeLarge="largest" />
          </Section>
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
          {morePosts.length > 0 && <MorePosts posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allPosts = (await getAllPostsForHome(preview)) ?? []
  return {
    props: { preview, allPosts },
  }
}

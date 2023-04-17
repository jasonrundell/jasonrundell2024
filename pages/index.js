import React from 'react'
import Head from 'next/head'
import {
  Section,
  Spacer,
  Box,
  Row,
  Heading,
  Paragraph,
  Link,
} from '@jasonrundell/dropship'

import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
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
            <Container>
              <Box>
                <Row>
                  <Heading label="Jason Rundell" />
                </Row>
                <Row>
                  <Heading level={2} label="Full Stack Web Developer" />
                </Row>
                <Row>
                  <Paragraph>
                    Hello. I&apos;m a developer who loves learning and using the
                    latest in front end web development. My skill set includes
                    experience with React, Gatsby, AEM, Contentful, WordPress,
                    Git, Gulp, Grunt, Parcel, PHP, MySQL, SASS, CSS, HTML,
                    JavaScript, and Amazon Web Services.
                  </Paragraph>
                  <Paragraph>
                    My love of building web experiences started in my high
                    school&apos;s library in 1997 with GeoCities and it&apos;s
                    been rewarding ever since! As you can imagine, with over 20
                    years of love for the web, I have been a part of a wide
                    variety of web projects: from iframes, to Flash, WordPress
                    multisites, jQuery Mobile, custom CMS applications, a
                    Facebook contest platform, React design systems, and now
                    Jamstack with headless CMS integration. Whatever the latest
                    trend is, I&apos;m either deeply involved or experimenting
                    with it in my spare time. My skills and experiences are
                    deep, wide-ranging, and I am always seeking new best
                    practices and methodologies. I embrace change, crave
                    challenge, and love technology!
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
              </Box>
            </Container>
            <Spacer sizeLarge="largest" />
          </Section>
          <Intro />
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
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
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

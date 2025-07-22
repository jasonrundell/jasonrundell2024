import React from 'react'
import Link from 'next/link'
import { Row, Grid, Spacer } from '@jasonrundell/dropship'

import {
  getSkills,
  getProjects,
  getReferences,
  getPositions,
  getPosts,
} from '@/lib/contentful'

import {
  StyledDivBgDark,
  StyledIntroParagraph,
  StyledContainer,
  StyledList,
  StyledListItem,
  StyledSection,
} from '@/styles/common'

import Skills from '@/components/Skills'
import ContactList from '@/components/ContactList'
import References from '@/components/References'
import Positions from '@/components/Positions'
import MorePosts from '@/components/MorePosts'
import Icon from '@/components/Icon'

export default async function page() {
  const skills = await getSkills()
  const projects = await getProjects()
  const references = await getReferences()
  const positions = await getPositions()
  const posts = await getPosts()

  return (
    <>
      <StyledContainer>
        <StyledSection id="home">
          <Row>
            <StyledIntroParagraph>
              Hey! I&apos;m an experienced developer who loves learning and
              using the latest in front-end web development. I have a wealth of
              experience and love for back-end, DevOps, database design,
              component-driven design, design systems, and leading with empathy
              as a manager or tech&nbsp;lead.
            </StyledIntroParagraph>
            <p>
              My passion for creating web experiences began in my high
              school&apos;s library back in 1997 when I discovered GeoCities.
              Since then, I&apos;ve been fortunate to work on a diverse range of
              projects spanning multiple technologies, including iframes, Flash,
              WordPress multisites, jQuery Mobile, custom CMS applications, a
              Facebook contest platform, React design systems, Jamstack
              architecture, and most recently, exploration of the possibilities
              and limitations of automation, AI, and AGI (Artificial General
              Intelligence).
            </p>
            <p>
              I&apos;m constantly exploring new trends and experimenting with
              emerging technologies in my spare time to expand my skills and
              knowledge. As a lifelong learner, I embrace change, seek out
              challenges, and thrive on the fast-paced nature of the tech
              industry. After 20 years, I still love working on the web!
            </p>
          </Row>
          <Row>
            <ContactList />
          </Row>
        </StyledSection>
        <Grid columnGap="2rem">
          <StyledSection id="skills">
            <h2>Skills</h2>
            <Row>{skills && <Skills skills={skills} />}</Row>
          </StyledSection>
          <StyledSection id="experience">
            <h2>Experience</h2>
            <Row>
              {positions.length > 0 && <Positions positions={positions} />}
            </Row>
            <Row>
              <StyledList>
                <StyledListItem>
                  <Icon type="LinkedIn" />{' '}
                  <Link
                    href="https://www.linkedin.com/in/jasonrundell/"
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label="See more on LinkedIn"
                    className="link"
                  >
                    See more on LinkedIn
                  </Link>
                </StyledListItem>
              </StyledList>
            </Row>
          </StyledSection>
          <StyledSection id="projects">
            <h2>Projects</h2>
            <Row>
              <StyledList>
                {projects.length > 0 &&
                  projects.map((project) => (
                    <StyledListItem key={project.slug}>
                      <Icon type="GitHub" />{' '}
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={project.title}
                        className="link"
                      >
                        {project.title}
                      </Link>
                    </StyledListItem>
                  ))}
              </StyledList>
            </Row>
          </StyledSection>
        </Grid>
        <StyledSection id="recommendations">
          <h2>Recommendations</h2>
          <Row>
            {references.length > 0 && <References references={references} />}
          </Row>
        </StyledSection>
      </StyledContainer>

      <StyledDivBgDark>
        <StyledContainer>
          <StyledSection id="blog">
            <Spacer />
            <h2>Blog</h2>
            <Spacer />
            <Row>{posts.length > 0 && <MorePosts posts={posts} />}</Row>
          </StyledSection>
        </StyledContainer>
      </StyledDivBgDark>
    </>
  )
}

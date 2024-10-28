import React from 'react'
import Head from 'next/head'
import { Row, Link, Grid } from '@jasonrundell/dropship'
import styled from '@emotion/styled'

import { getAllSkillsForHome } from '../lib/api/skills'
import { getAllReferencesForHome } from '../lib/api/references'
import { getAllPositionsForHome } from '../lib/api/positions'
import { getAllPostsForHome } from '../lib/api/posts'
import { getAllProjectsForHome } from '../lib/api/projects'
import { SITE_NAME } from '../lib/constants'
import { tokens } from '../data/tokens'

import Layout from '../components/Layout'
import Positions from '../components/Positions'
import References from '../components/References'
import Skills from '../components/Skills'
import Icon from '../components/Icon'
import ContactList from '../components/ContactList'
import MorePosts from '../components/more-posts'
import MoreProjects from '../components/more-projects'

export default function Index({
  preview,
  allSkills,
  allReferences,
  allPositions,
  allPosts,
  allProjects,
}) {
  const skills = allSkills
  const references = allReferences
  const positions = allPositions
  const posts = allPosts.slice(0)
  const projects = allProjects.slice(0)

  const StyledDivBgDark = styled.div`
    background-color: ${tokens['--background-color-2']};
  `

  const StyledIntroParagraph = styled.p`
    font-size: 1.75rem;
    line-height: 1.3;

    @media (min-width: 768px) {
      font-size: 2.75rem;
    }
  `

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 768px) {
      margin: 0 auto;
      max-width: 64rem;
    }
  `

  const StyledList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    width: 100%;
  `

  const StylesListItem = styled.li`
    margin: 0;
  `

  const StyledSection = styled.section`
    padding: 2rem 0;
  `

  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>{SITE_NAME}</title>
        </Head>
        <StyledContainer>
          <StyledSection id="home">
            <Row>
              <StyledIntroParagraph>
                Hey! I&apos;m an experienced developer who loves learning and
                using the latest in front end web development. I have a wealth
                of experience and love for back end, dev ops, database design,
                component driven design, design systems, and leading with
                empathy as a manager or tech&nbsp;lead.
              </StyledIntroParagraph>
              <p>
                My passion for creating web experiences began in my high
                school&apos;s library back in 1997 when I discovered GeoCities.
                Since then, I&apos;ve been fortunate to work on a diverse range
                of projects spanning multiple technologies, including iframes,
                Flash, WordPress multisites, jQuery Mobile, custom CMS
                applications, a Facebook contest platform, React design systems,
                Jamstack architecture, and most recently, exploration of the
                possibilities and limitations of automation, AI and AGI
                (Artificial General Intelligence).
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
          <Grid
            gridTemplateColumns="1fr"
            mediumTemplateColumns="1fr 1fr"
            largeTemplateColumns="1fr 1fr"
            columnGap="2rem"
            breakInside="avoid"
          >
            <StyledSection id="skills">
              <h2>Skills</h2>
              <Row>{skills.length > 0 && <Skills items={skills} />}</Row>
            </StyledSection>
            <StyledSection id="experience">
              <h2>Experience</h2>
              <Row>
                {positions.length > 0 && <Positions positions={positions} />}
              </Row>
              <Row>
                <StyledList>
                  <StylesListItem>
                    <Icon type="LinkedIn" />{' '}
                    <Link
                      href="https://www.linkedin.com/in/jasonrundell/"
                      rel="noopener noreferrer"
                      target="_blank"
                      label="See more on LinkedIn"
                    />
                  </StylesListItem>
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
              <h2>Blog</h2>
              <Row>{posts.length > 0 && <MorePosts items={posts} />}</Row>
            </StyledSection>
            <StyledSection id="projects">
              <h2>Projects</h2>
              <Row>
                {projects.length > 0 && <MoreProjects items={projects} />}
              </Row>
            </StyledSection>
          </StyledContainer>
        </StyledDivBgDark>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const allSkills = (await getAllSkillsForHome(preview)) ?? []
  const allReferences = (await getAllReferencesForHome(preview)) ?? []
  const allPositions = (await getAllPositionsForHome(preview)) ?? []
  const allPosts = (await getAllPostsForHome(preview)) ?? []
  const allProjects = (await getAllProjectsForHome(preview)) ?? []
  return {
    props: {
      preview,
      allSkills,
      allReferences,
      allPositions,
      allPosts,
      allProjects,
    },
  }
}

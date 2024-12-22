'use client'

import { useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from '@emotion/styled'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
import ProjectHeader from '@/components/ProjectHeader'
// import MoreProjects from '@/components/MoreProjects'

import { SITE_NAME } from '@/lib/constants'
import { tokens } from '@/data/tokens'
import { Project as ProjectDef } from '@/typeDefinitions/app'

interface ProjectProps {
  project: ProjectDef
}

const customMarkdownOptions = (content: ProjectDef['description']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
})

const Project = ({ project }: ProjectProps) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Apply style to the first paragraph in the content
      const firstParagraph = contentRef.current.querySelector('p')
      if (firstParagraph) {
        firstParagraph.style.fontSize = tokens['--size-large']
      }
    }
  }, [project])

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 48rem) {
      margin: 0 auto;
      max-width: 64rem;
    }
  `

  const StyledSection = styled.section`
    padding: ${tokens['--size-xlarge']} 0;
  `

  const Breadcrumb = styled.div`
    font-size: ${tokens['--size-small']};
    padding-bottom: ${tokens['--size-large']};
  `

  const StyledBody = styled.div`
    p,
    h2,
    h3,
    h4,
    h5,
    h6 {
      width: 100%;
    }
  `

  const StyledMorePostsHeading = styled.h2`
    font-size: ${tokens['--size-large']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
  `

  const StyledDivBgDark = styled.div`
    background-color: ${tokens['--background-color-2']};
  `

  const StyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-flow: column;
  `

  const StyledListItem = styled.li`
    margin: 0;
    padding: 0 0 0.5rem 0;
  `

  const { title, featuredImage, link, technology, description } = project

  return (
    <>
      <Head>
        <title>{project ? `${project.title} | ${SITE_NAME}` : SITE_NAME}</title>
        {featuredImage?.fields?.file && (
          <meta
            property="og:image"
            content={featuredImage.fields.file.fields.file.url}
          />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          <Breadcrumb>
            <Link href={`/`}>Home</Link> &gt;{' '}
            <Link href={`/#projects`}>Projects</Link> &gt; {project.title}
          </Breadcrumb>
          <article>
            <ProjectHeader project={project as ProjectDef} />
            <Spacer
              smallScreen="medium"
              mediumScreen="large"
              largeScreen="xlarge"
            />
            <Grid largeTemplateColumns="1fr 3fr">
              <div>
                <h3>Tech stack</h3>
                <Row>
                  <StyledList>
                    {technology.map((tech, index) => (
                      <StyledListItem key={index}>{tech}</StyledListItem>
                    ))}
                  </StyledList>
                </Row>
              </div>
              <div>
                <h3>About</h3>
                <StyledBody className="project-content" ref={contentRef}>
                  <section>
                    <Row>
                      {documentToReactComponents(
                        description as unknown as Document,
                        customMarkdownOptions(description)
                      )}
                    </Row>
                  </section>
                </StyledBody>
              </div>
            </Grid>
          </article>
          <Spacer />
        </StyledSection>
      </StyledContainer>
      {/* {projects && projects.length > 0 && (
        <StyledDivBgDark>
          <StyledContainer>
            <StyledSection>
              <StyledMorePostsHeading>More projects</StyledMorePostsHeading>
              <Spacer />
              <MoreProjects items={projects} />
            </StyledSection>
          </StyledContainer>
        </StyledDivBgDark>
      )} */}
    </>
  )
}

export default Project

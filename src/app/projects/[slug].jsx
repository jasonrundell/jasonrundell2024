import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import ErrorPage from 'next/error'
import styled from '@emotion/styled'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import PostBody from '../../components/PostBody'
import ProjectHeader from '../../components/ProjectHeader'
import MoreProjects from '../../components/MoreProjects'
import Layout from '../../components/Layout'
import {
  getAllProjectsWithSlug,
  getProjectAndMoreProjects,
} from '../../lib/api/projects'
import { SITE_NAME } from '../../lib/constants'
import { tokens } from '../../data/tokens'

export default function Project({ project, projects, preview }) {
  const router = useRouter()
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      // Apply style to the first paragraph in the content
      const firstParagraph = contentRef.current.querySelector('p')
      if (firstParagraph) {
        firstParagraph.style.fontSize = tokens['--size-large']
      }
    }
  }, [project])

  if (!router.isFallback && !project) {
    return <ErrorPage statusCode={404} />
  }

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

  return (
    <Layout preview={preview}>
      <Head>
        <title>{project ? `${project.title} | ${SITE_NAME}` : SITE_NAME}</title>
        {project?.featuredImage?.file && (
          <meta property="og:image" content={project.featuredImage.file.url} />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          {router.isFallback ? (
            <StyledMorePostsHeading>Loading…</StyledMorePostsHeading>
          ) : (
            <>
              <Breadcrumb>
                <Link href={`/`}>Home</Link> &gt;{' '}
                <Link href={`/#projects`}>Projects</Link> &gt; {project.title}
              </Breadcrumb>
              <article>
                <ProjectHeader
                  title={project.title}
                  featuredImage={project.featuredImage}
                  link={project.link}
                />
                <Spacer
                  smallScreen="large"
                  mediumScreen="larger"
                  largeScreen="largest"
                />
                <Grid largeTemplateColumns="1fr 3fr">
                  <div>
                    <h3>Tech stack</h3>
                    <Row>
                      <StyledList>
                        {project.technology.map((tech, index) => (
                          <StyledListItem key={index}>{tech}</StyledListItem>
                        ))}
                      </StyledList>
                    </Row>
                  </div>
                  <div>
                    <h3>About</h3>
                    <StyledBody className="project-content" ref={contentRef}>
                      <PostBody content={project.description} />
                    </StyledBody>
                  </div>
                </Grid>
              </article>
              <Spacer />
            </>
          )}
        </StyledSection>
      </StyledContainer>
      {projects && projects.length > 0 && (
        <StyledDivBgDark>
          <StyledContainer>
            <StyledSection>
              <StyledMorePostsHeading>More projects</StyledMorePostsHeading>
              <Spacer />
              <MoreProjects items={projects} />
            </StyledSection>
          </StyledContainer>
        </StyledDivBgDark>
      )}
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getProjectAndMoreProjects(params.slug, preview)
  return {
    props: {
      project: data?.project ?? null,
      projects: data?.moreProjects ?? null,
      preview,
    },
  }
}

export async function getStaticPaths() {
  const allProjects = await getAllProjectsWithSlug()
  return {
    paths: allProjects?.map(({ slug }) => `/projects/${slug}`) ?? [],
    fallback: true,
  }
}

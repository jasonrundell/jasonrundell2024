import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import ErrorPage from 'next/error'
import styled from '@emotion/styled'
import { Spacer } from '@jasonrundell/dropship'
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

  useEffect(() => {
    // Apply style to the first paragraph in the content
    const firstParagraph = document.querySelector('.project-content p')
    if (firstParagraph) {
      firstParagraph.style.fontSize = tokens['--size-large']
    }
  }, [])

  if (!router.isFallback && !project) {
    return <ErrorPage statusCode={404} />
  }

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 768px) {
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
                  technologies={project.technology}
                />
                <Spacer
                  smallScreen="large"
                  mediumScreen="larger"
                  largeScreen="largest"
                />
                <h3>About</h3>
                <StyledBody className="project-content">
                  <PostBody content={project.description} />
                </StyledBody>
              </article>
              <Spacer />
            </>
          )}
        </StyledSection>
      </StyledContainer>
      {projects && projects.length > 0 && (
        <StyledDivBgDark>
          <StyledContainer>
            <StyledSection id="more-projects">
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

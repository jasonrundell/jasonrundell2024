import Head from 'next/head'
import Link from 'next/link'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { styled } from '@pigment-css/react'

import { getEntryBySlug } from '@/lib/contentful'
// import MoreProjects from '@/components/MoreProjects'
import ProjectHeader from '@/components/ProjectHeader'
import { SITE_NAME } from '@/lib/constants'
import { Project } from '@/typeDefinitions/app'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledList,
  StyledBreadcrumb,
} from '@/styles/common'

type ProjectProps = {
  params: {
    slug: string
  }
}

const customMarkdownOptions = (content: Project['description']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
})

const StyledListItem = styled('li')({
  margin: 0,
  padding: '0 0 0.5rem 0',
})

export default async function page({ params }: ProjectProps) {
  const { slug } = params

  const project = await getEntryBySlug<Project>('project', slug)

  if (!project.title) {
    notFound()
  }

  const { title, featuredImage, technology, description } = project

  console.log('PROJECT title', title)

  return (
    <>
      <Head>
        <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
        {featuredImage?.fields?.file && (
          <meta
            property="og:image"
            content={featuredImage.fields.file.fields.file.url}
          />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          <StyledBreadcrumb>
            <Link href={`/`}>Home</Link> &gt;{' '}
            <Link href={`/#projects`}>Projects</Link> &gt; {title}
          </StyledBreadcrumb>
          <article>
            <ProjectHeader project={project as Project} />
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
                <StyledBody>
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

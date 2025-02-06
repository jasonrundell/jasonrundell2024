import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document, BLOCKS } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'

import { getEntryBySlug } from '@/lib/contentful'
// import MoreProjects from '@/components/MoreProjects'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { Project } from '@/typeDefinitions/app'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledList,
  StyledListItem,
  StyledBreadcrumb,
  StyledHeading,
  StyledHeading3,
  StyledEmbeddedAsset,
} from '@/styles/common'

type ProjectProps = {
  params: Promise<{ slug: string }>
}

const customMarkdownOptions = (content: Project['description']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      if (
        !node ||
        !node.data ||
        !node.data.target ||
        !node.data.target.fields
      ) {
        return null
      }

      const { file, description } = node.data.target.fields
      const imageUrl = file.url.startsWith('//')
        ? `https:${file.url}`
        : file.url
      return (
        <StyledEmbeddedAsset>
          <Image
            src={imageUrl}
            alt={description}
            layout="responsive"
            width={500}
            height={300}
          />
        </StyledEmbeddedAsset>
      )
    },
  },
})

export async function generateMetadata(
  { params }: ProjectProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  const project = await getEntryBySlug<Project>('project', slug)

  return {
    title: `Jason Rundell | Project: ${project.title}`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: [`https://${project.featuredImage?.fields.file.fields.file.url}`],
    },
  }
}

export default async function page({ params }: ProjectProps) {
  const slug = (await params).slug

  const project = await getEntryBySlug<Project>('project', slug)

  if (!project.title) {
    notFound()
  }

  const { title, featuredImage, technology, description, link } = project

  return (
    <>
      <StyledContainer>
        <StyledBreadcrumb>
          <Link href={`/`}>Home</Link> &gt;{' '}
          <Link href={`/#projects`}>Projects</Link> &gt; {title}
        </StyledBreadcrumb>
        <StyledSection id="project">
          <article>
            <Grid largeTemplateColumns="1fr 3fr" columnGap="3rem">
              <div>
                <header>
                  <StyledHeading>{title}</StyledHeading>
                </header>
                {link && (
                  <>
                    <StyledHeading3 level={3}>View</StyledHeading3>
                    <Row>
                      <Link href={link} target="_blank">
                        Visit GitHub project
                      </Link>
                    </Row>
                  </>
                )}
                <Spacer
                  smallScreen="medium"
                  mediumScreen="large"
                  largeScreen="xlarge"
                />
                <StyledHeading3 level={3}>Tech stack</StyledHeading3>
                <Row>
                  <StyledList>
                    {technology.map((tech, index) => (
                      <StyledListItem key={index}>{tech}</StyledListItem>
                    ))}
                  </StyledList>
                </Row>
              </div>
              <div>
                <StyledHeading3 level={3}>About</StyledHeading3>
                <StyledBody>
                  <section>
                    {documentToReactComponents(
                      description as unknown as Document,
                      customMarkdownOptions(description)
                    )}
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

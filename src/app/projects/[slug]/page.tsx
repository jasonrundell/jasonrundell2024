import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document, BLOCKS } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'

import { getEntryBySlug } from '@/lib/contentful'
// import MoreProjects from '@/components/MoreProjects'
import { SITE_NAME } from '@/lib/constants'
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
  params: {
    slug: string
  }
}

const customMarkdownOptions = (content: Project['description']) => ({
  renderNode: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
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

export default async function page({ params }: ProjectProps) {
  const { slug } = params

  const project = await getEntryBySlug<Project>('project', slug)

  if (!project.title) {
    notFound()
  }

  const { title, featuredImage, technology, description, link } = project

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

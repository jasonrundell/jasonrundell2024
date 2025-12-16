import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document, BLOCKS } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { sanitizeHTML } from '@/lib/sanitize'

import { getEntryBySlug } from '@/lib/contentful'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { Project } from '@/typeDefinitions/app'
import ProjectGallery from '@/components/ProjectGallery'
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

/**
 * Custom markdown options for rendering Contentful rich text.
 * Sanitizes HTML content to prevent XSS attacks.
 */
const customMarkdownOptions = () => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(String(text)),
        }}
      />
    ),
  },
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: unknown) => {
      const nodeData = node as {
        data?: {
          target?: {
            fields?: {
              file?: { url: string }
              description?: string
            }
          }
        }
      }

      if (
        !nodeData ||
        !nodeData.data ||
        !nodeData.data.target ||
        !nodeData.data.target.fields
      ) {
        return null
      }

      const { file, description } = nodeData.data.target.fields

      if (!file?.url) {
        return null
      }

      const imageUrl = file.url.startsWith('//')
        ? `https:${file.url}`
        : file.url
      return (
        <StyledEmbeddedAsset>
          <Image
            src={imageUrl}
            alt={description || 'Project image'}
            width={500}
            height={300}
            style={{ width: '100%', height: 'auto' }}
          />
        </StyledEmbeddedAsset>
      )
    },
  },
})

export async function generateMetadata({
  params,
}: ProjectProps): Promise<Metadata> {
  const slug = (await params).slug

  const project = await getEntryBySlug<Project>('project', slug)

  const imageUrl = project.featuredImage?.fields?.file?.fields?.file?.url
    ? `https://${project.featuredImage.fields.file.fields.file.url}`
    : undefined

  return {
    title: `${project.title} | Jason Rundell`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function page({ params }: ProjectProps) {
  const slug = (await params).slug

  const project = await getEntryBySlug<Project>('project', slug)

  if (!project.title) {
    notFound()
  }

  const { title, technology, description, link, siteLink, gallery } = project

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
                    <Row>
                      <Link
                        href={link}
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit GitHub project
                      </Link>
                    </Row>
                    {siteLink && (
                      <>
                        <Spacer />
                        <Row>
                          <Link
                            href={siteLink}
                            className="link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Project&apos;s Website
                          </Link>
                        </Row>
                      </>
                    )}
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
                      customMarkdownOptions()
                    )}
                  </section>
                  {gallery && gallery.length > 0 && (
                    <>
                      <Spacer />
                      <StyledHeading3 level={3}>Gallery</StyledHeading3>
                      <ProjectGallery images={gallery} />
                    </>
                  )}
                </StyledBody>
              </div>
            </Grid>
          </article>
        </StyledSection>
      </StyledContainer>
    </>
  )
}

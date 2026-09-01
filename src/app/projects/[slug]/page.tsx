import type { Metadata } from 'next'
import Link from 'next/link'
import { styled } from '@pigment-css/react'
import { notFound } from 'next/navigation'

import { getEntryBySlug, getProjects } from '@/lib/content'
import RenderedMDX from '@/components/markdown/RenderedMDX'
import ContentImage from '@/components/ContentImage'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { buildPageMetadata } from '@/lib/metadata'
import ProjectGalleryLazy from '@/components/ProjectGalleryLazy'
import { BandSection, Container, DisplayTitle, Lead } from '@/styles/editorial'
import { StyledBody, StyledBreadcrumb } from '@/styles/common'
import CommentsSection from '@/components/comments/CommentsSection'
import Tokens from '@/lib/tokens'

const bp = `${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes.breakpoints.medium.unit}`

type ProjectProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: ProjectProps): Promise<Metadata> {
  const slug = (await params).slug
  const project = await getEntryBySlug('project', slug)

  return buildPageMetadata({
    title: `${project.title} | Jason Rundell`,
    description: project.excerpt || SITE_DESCRIPTION,
    path: `/projects/${slug}`,
    type: 'article',
    publishedTime: project.createdDate,
    image: project.featuredImage?.src
      ? {
          src: project.featuredImage.src,
          alt: project.featuredImage.alt || project.title,
          width: project.featuredImage.width,
          height: project.featuredImage.height,
        }
      : undefined,
  })
}

const StyledMeta = styled('p')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: ${Tokens.colors.accent.var};
  margin: 0 0 0.75rem;
`

const StyledLinkRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 1.75rem;
  margin-top: 1.5rem;
`

const StyledProjectLink = styled('a')`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${Tokens.colors.accent.var};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${Tokens.colors.accentSoft.var};
  }
`

/** 3:2 frame matching the thumbnail language - hairline, sharp corners. */
const StyledFeatured = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfacePrimary.var};
`

const StyledFigure = styled('figure')`
  margin: 2.5rem 0 0;
`

const StyledCaption = styled('figcaption')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.6875rem;
  color: ${Tokens.colors.inkFaint.var};
  margin: 0.75rem 0 0;
`

const StyledBodyGrid = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: ${bp}) {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
  }
`

const StyledSidebar = styled('aside')`
  @media (min-width: ${bp}) {
    flex: none;
    width: 16.25rem;
  }
`

const StyledMain = styled('div')`
  min-width: 0;
  flex: 1;
`

const StyledSideHeading = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
  margin: 0 0 0.875rem;
`

const StyledGalleryHeading = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
  margin: 2rem 0 0.875rem;
`

const StyledStackList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
`

const StyledStackItem = styled('li')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.8125rem;
  color: ${Tokens.colors.inkMuted.var};
  padding: 0.5rem 0;
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
`

export default async function page({ params }: ProjectProps) {
  const slug = (await params).slug
  const project = await getEntryBySlug('project', slug)

  if (!project.title) {
    notFound()
  }

  const {
    title,
    technology,
    description,
    excerpt,
    link,
    siteLink,
    storybookLink,
    gallery,
    featuredImage,
    createdDate,
  } = project

  const year = new Date(createdDate).getUTCFullYear()

  return (
    <>
      <BandSection tone="paper">
        <Container>
          <StyledBreadcrumb>
            <Link href={`/`}>Home</Link> &gt;{' '}
            <Link href={`/projects`}>Projects</Link> &gt; {title}
          </StyledBreadcrumb>
          {!Number.isNaN(year) && <StyledMeta>{year}</StyledMeta>}
          <DisplayTitle>{title}</DisplayTitle>
          {excerpt && <Lead>{excerpt}</Lead>}
          {(link || siteLink || storybookLink) && (
            <StyledLinkRow>
              {link && (
                <StyledProjectLink
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit GitHub project &rarr;
                </StyledProjectLink>
              )}
              {siteLink && (
                <StyledProjectLink
                  href={siteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit project&apos;s website &rarr;
                </StyledProjectLink>
              )}
              {storybookLink && (
                <StyledProjectLink
                  href={storybookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit project&apos;s Storybook &rarr;
                </StyledProjectLink>
              )}
            </StyledLinkRow>
          )}

          {featuredImage && (
            <StyledFigure>
              <StyledFeatured>
                <ContentImage
                  src={featuredImage.src}
                  alt={featuredImage.alt || title}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 1152px"
                />
              </StyledFeatured>
              {featuredImage.description && (
                <StyledCaption>{featuredImage.description}</StyledCaption>
              )}
            </StyledFigure>
          )}
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <article>
            <StyledBodyGrid>
              <StyledSidebar>
                <StyledSideHeading>Tech stack</StyledSideHeading>
                <StyledStackList>
                  {technology.map((tech) => (
                    <StyledStackItem key={tech}>{tech}</StyledStackItem>
                  ))}
                </StyledStackList>
              </StyledSidebar>
              <StyledMain>
                <StyledSideHeading>About</StyledSideHeading>
                <StyledBody>
                  <section>
                    <RenderedMDX source={description} />
                  </section>
                  {gallery && gallery.length > 0 && (
                    <>
                      <StyledGalleryHeading>Gallery</StyledGalleryHeading>
                      <ProjectGalleryLazy images={gallery} />
                    </>
                  )}
                </StyledBody>
              </StyledMain>
            </StyledBodyGrid>
          </article>
          <CommentsSection contentType="project" contentSlug={slug} />
        </Container>
      </BandSection>
    </>
  )
}

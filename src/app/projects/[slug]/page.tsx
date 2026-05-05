import type { Metadata } from 'next'
import Link from 'next/link'
import { Grid, Row, Spacer } from '@jasonrundell/dropship'
import { notFound } from 'next/navigation'

import { getEntryBySlug, getProjects } from '@/lib/content'
import RenderedMDX from '@/lib/markdown'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { Project } from '@/typeDefinitions/app'
import ProjectGalleryLazy from '@/components/ProjectGalleryLazy'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledList,
  StyledListItem,
  StyledBreadcrumb,
  StyledHeading,
  StyledHeading3,
  StyledLink,
} from '@/styles/common'
import CommentsSection from '@/components/comments/CommentsSection'

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
  const project = await getEntryBySlug<Project>('project', slug)

  return {
    title: `${project.title} | Jason Rundell`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: project.featuredImage?.src ? [project.featuredImage.src] : [],
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
          <Link href={`/projects`}>Projects</Link> &gt; {title}
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
                      <StyledLink
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit GitHub project
                      </StyledLink>
                    </Row>
                    {siteLink && (
                      <>
                        <Spacer />
                        <Row>
                          <StyledLink
                            href={siteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Project&apos;s Website
                          </StyledLink>
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
                    <RenderedMDX source={description} />
                  </section>
                  {gallery && gallery.length > 0 && (
                    <>
                      <Spacer />
                      <StyledHeading3 level={3}>Gallery</StyledHeading3>
                      <ProjectGalleryLazy images={gallery} />
                    </>
                  )}
                </StyledBody>
              </div>
            </Grid>
          </article>
          <CommentsSection contentType="project" contentSlug={slug} />
        </StyledSection>
      </StyledContainer>
    </>
  )
}

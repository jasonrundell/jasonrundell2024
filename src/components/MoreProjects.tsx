'use client'

import { styled } from '@pigment-css/react'

import ProjectPreview from './ProjectPreview'
import { ProjectCardItem } from '@/typeDefinitions/app'
import { RevealStaggerGroup, RevealStaggerItem } from '@/styles/motion'

interface MoreProjectsProps {
  items: ProjectCardItem[]
  /** Render each row with its 3:2 featured-image thumbnail. */
  showThumbnails?: boolean
}

const StyledList = styled('div')`
  display: flex;
  flex-direction: column;
`

export default function MoreProjects({
  items,
  showThumbnails = false,
}: MoreProjectsProps) {
  return (
    <section id="more-projects">
      <RevealStaggerGroup>
        <StyledList>
          {items.map((project, index) => (
            <RevealStaggerItem key={project.slug} index={index}>
              <ProjectPreview
                title={project.title}
                slug={project.slug}
                excerpt={project.excerpt}
                createdDate={project.createdDate}
                technology={project.technology}
                featuredImage={project.featuredImage}
                showThumbnail={showThumbnails}
              />
            </RevealStaggerItem>
          ))}
        </StyledList>
      </RevealStaggerGroup>
    </section>
  )
}

'use client'

import dynamic from 'next/dynamic'
import type { ContentImage } from '@/typeDefinitions/app'

const ProjectGallery = dynamic(() => import('@/components/ProjectGallery'), {
  loading: () => <div role="status" aria-live="polite">Loading gallery...</div>,
  ssr: false,
})

export default function ProjectGalleryLazy({
  images,
}: {
  images: ContentImage[]
}) {
  return <ProjectGallery images={images} />
}

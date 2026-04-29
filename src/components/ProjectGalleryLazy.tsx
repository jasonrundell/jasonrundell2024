'use client'

import dynamic from 'next/dynamic'
import type { GalleryImage } from '@/typeDefinitions/app'

const ProjectGallery = dynamic(() => import('@/components/ProjectGallery'), {
  loading: () => <div>Loading gallery...</div>,
  ssr: false,
})

export default function ProjectGalleryLazy({
  images,
}: {
  images: GalleryImage[]
}) {
  return <ProjectGallery images={images} />
}

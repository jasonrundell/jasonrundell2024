import { toProjectCardItem } from './projectUtils'
import { Project } from '@/typeDefinitions/app'

const baseProject: Project = {
  title: 'Test Project',
  slug: 'test-project',
  order: 1,
  excerpt: 'A test excerpt',
  description: '',
  technology: ['TypeScript'],
}

describe('toProjectCardItem', () => {
  it('maps a project with full featuredImage data', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        src: '/content/projects/test-project/featured.webp',
        alt: 'Alt text',
        description: 'Image description',
      },
    }

    const result = toProjectCardItem(project)

    expect(result).toEqual({
      title: 'Test Project',
      excerpt: 'A test excerpt',
      slug: 'test-project',
      featuredImage: {
        file: { url: '/content/projects/test-project/featured.webp' },
        altText: 'Alt text',
        description: 'Image description',
      },
    })
  })

  it('omits featuredImage when the source project has no image', () => {
    const result = toProjectCardItem(baseProject)

    expect(result).toEqual({
      title: 'Test Project',
      excerpt: 'A test excerpt',
      slug: 'test-project',
    })
    expect(result.featuredImage).toBeUndefined()
  })

  it('defaults missing alt text and description to empty strings when a src is present', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: {
        src: '/content/projects/test-project/featured.webp',
        alt: '',
      },
    }

    const result = toProjectCardItem(project)

    expect(result.featuredImage).toEqual({
      file: { url: '/content/projects/test-project/featured.webp' },
      altText: '',
      description: '',
    })
  })

  it('omits featuredImage when src is empty', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: { src: '', alt: 'Alt' },
    }

    const result = toProjectCardItem(project)
    expect(result.featuredImage).toBeUndefined()
  })

  it('defaults undefined alt and description to empty strings via nullish coalescing', () => {
    const project: Project = {
      ...baseProject,
      featuredImage: { src: '/content/projects/test-project/featured.webp' },
    }

    const result = toProjectCardItem(project)
    expect(result.featuredImage?.altText).toBe('')
    expect(result.featuredImage?.description).toBe('')
  })
})

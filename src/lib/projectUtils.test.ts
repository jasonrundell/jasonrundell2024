import { compareProjectsByDateDesc, toProjectCardItem } from './projectUtils'
import { Project } from '@/typeDefinitions/app'

const baseProject: Project = {
  title: 'Test Project',
  slug: 'test-project',
  createdDate: '2025-01-01T00:00:00.000Z',
  excerpt: 'A test excerpt',
  description: '',
  technology: ['TypeScript'],
}

describe('compareProjectsByDateDesc', () => {
  it('orders newer projects before older ones', () => {
    const older: Project = { ...baseProject, createdDate: '2020-01-01T00:00:00.000Z' }
    const newer: Project = {
      ...baseProject,
      slug: 'p2',
      createdDate: '2021-01-01T00:00:00.000Z',
    }
    expect(compareProjectsByDateDesc(older, newer)).toBeGreaterThan(0)
    expect(compareProjectsByDateDesc(newer, older)).toBeLessThan(0)
  })
})

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

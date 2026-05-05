import { buildPersonJsonLd, buildBlogPostingJsonLd } from './jsonld'
import type { Post } from '@/typeDefinitions/app'
import { SITE_DOMAIN } from '@/lib/constants'

describe('buildPersonJsonLd', () => {
  it('returns a schema.org Person with the expected identity', () => {
    const ld = buildPersonJsonLd()

    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Jason Rundell')
    expect(ld.url).toBe(`${SITE_DOMAIN}/about`)
    expect(ld.sameAs).toEqual(
      expect.arrayContaining([
        'https://www.linkedin.com/in/jasonrundell/',
        'https://github.com/jasonrundell',
      ])
    )
  })
})

describe('buildBlogPostingJsonLd', () => {
  const basePost: Post = {
    title: 'Hello world',
    slug: 'hello-world',
    excerpt: 'A short excerpt',
    date: '2025-04-01',
    content: '',
    author: '',
  }

  it('returns a BlogPosting with the canonical url', () => {
    const ld = buildBlogPostingJsonLd(basePost, 'hello-world')

    expect(ld['@type']).toBe('BlogPosting')
    expect(ld.headline).toBe('Hello world')
    expect(ld.description).toBe('A short excerpt')
    expect(ld.datePublished).toBe('2025-04-01')
    expect(ld.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/posts/hello-world`,
    })
  })

  it('falls back to site description when excerpt is empty', () => {
    const ld = buildBlogPostingJsonLd({ ...basePost, excerpt: '' }, 'hello-world')

    expect(ld.description).toBeTruthy()
    expect(ld.description).not.toBe('')
  })

  it('includes featuredImage src in the JSON-LD image field', () => {
    const post: Post = {
      ...basePost,
      featuredImage: { src: '/content/posts/hello-world/featured.webp', alt: '' },
    }

    const ld = buildBlogPostingJsonLd(post, 'hello-world') as { image?: string }
    expect(ld.image).toBe('/content/posts/hello-world/featured.webp')
  })

  it('omits image when featuredImage is absent', () => {
    const ld = buildBlogPostingJsonLd(basePost, 'hello-world') as { image?: string }
    expect(ld.image).toBeUndefined()
  })

  it('includes author when provided', () => {
    const post: Post = { ...basePost, author: 'Jane Doe' }

    const ld = buildBlogPostingJsonLd(post, 'hello-world') as {
      author?: { '@type': string; name: string }
    }
    expect(ld.author).toEqual({ '@type': 'Person', name: 'Jane Doe' })
  })

  it('omits author when author is an empty string', () => {
    const ld = buildBlogPostingJsonLd(basePost, 'hello-world') as {
      author?: unknown
    }
    expect(ld.author).toBeUndefined()
  })
})

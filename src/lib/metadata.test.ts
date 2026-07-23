import { absoluteUrl, buildPageMetadata, buildRootMetadata } from './metadata'
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_DOMAIN,
} from './constants'

/** Narrows the `Metadata['openGraph']['images']` union down to one object. */
function firstOgImage(metadata: ReturnType<typeof buildPageMetadata>) {
  const images = metadata.openGraph?.images
  if (!Array.isArray(images)) throw new Error('expected an og:image array')
  const [image] = images
  if (typeof image !== 'object' || image === null || !('url' in image)) {
    throw new Error('expected an og:image object')
  }
  return image
}

describe('absoluteUrl', () => {
  it('resolves a root-relative path against the canonical origin', () => {
    expect(absoluteUrl('/about')).toBe(`${SITE_DOMAIN}/about`)
  })

  it('leaves an already-absolute URL alone', () => {
    expect(absoluteUrl('https://cdn.example.com/a.png')).toBe(
      'https://cdn.example.com/a.png'
    )
  })
})

describe('buildPageMetadata', () => {
  const page = buildPageMetadata({
    title: 'About | Jason Rundell',
    description: 'About the site author.',
    path: '/about',
  })

  it('sets the canonical URL from the page path', () => {
    expect(page.alternates?.canonical).toBe(`${SITE_DOMAIN}/about`)
  })

  it('gives Open Graph and Twitter the page title, not the site title', () => {
    expect(page.openGraph?.title).toBe('About | Jason Rundell')
    expect(page.twitter?.title).toBe('About | Jason Rundell')
  })

  it('falls back to the default share card at its declared dimensions', () => {
    expect(firstOgImage(page)).toMatchObject({
      url: `${SITE_DOMAIN}${OG_IMAGE_PATH}`,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    })
  })

  it('defaults to the website Open Graph type', () => {
    expect(page.openGraph).toMatchObject({ type: 'website' })
  })

  it('makes a relative share image absolute', () => {
    const withImage = buildPageMetadata({
      title: 'A post | Jason Rundell',
      description: 'A post.',
      path: '/posts/a-post',
      image: { src: '/content/posts/a-post/featured.webp', alt: 'Featured' },
    })

    expect(firstOgImage(withImage)).toMatchObject({
      url: `${SITE_DOMAIN}/content/posts/a-post/featured.webp`,
      alt: 'Featured',
    })
  })

  it('adds authorship and publication data for articles', () => {
    const article = buildPageMetadata({
      title: 'A post | Jason Rundell',
      description: 'A post.',
      path: '/posts/a-post',
      type: 'article',
      publishedTime: '2026-01-02',
    })

    expect(article.openGraph).toMatchObject({
      type: 'article',
      authors: ['Jason Rundell'],
      publishedTime: '2026-01-02',
    })
  })

  it('omits publishedTime when the entry has no date', () => {
    const article = buildPageMetadata({
      title: 'A project | Jason Rundell',
      description: 'A project.',
      path: '/projects/a-project',
      type: 'article',
    })

    expect(article.openGraph).not.toHaveProperty('publishedTime')
  })
})

describe('buildRootMetadata', () => {
  const root = buildRootMetadata()

  it('sets metadataBase so relative asset URLs resolve', () => {
    expect(root.metadataBase?.toString()).toBe(`${SITE_DOMAIN}/`)
  })

  it('links the web app manifest', () => {
    expect(root.manifest).toBe('/site.webmanifest')
  })

  it('declares icons that are served from public/', () => {
    const icons = root.icons as { icon: { url: string }[]; apple: unknown[] }
    const urls = icons.icon.map((entry) => entry.url)

    expect(urls).toContain('/favicon/favicon-32x32.png')
    expect(urls).toContain('/favicon/favicon-512x512.png')
    // src/app/favicon.ico is emitted by the file convention, not by us.
    expect(urls).not.toContain('/favicon.ico')
    expect(icons.apple).toHaveLength(1)
  })

  it('lets crawlers index the site with large image previews', () => {
    expect(root.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: { 'max-image-preview': 'large' },
    })
  })
})

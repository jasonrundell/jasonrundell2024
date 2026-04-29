import { Post } from '@/typeDefinitions/app'
import { SITE_DESCRIPTION, SITE_DOMAIN } from '@/lib/constants'

/**
 * Builds a schema.org `Person` object for the /about page.
 */
export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jason Rundell',
    jobTitle: 'Manager / Full Stack Developer',
    url: `${SITE_DOMAIN}/about`,
    sameAs: [
      'https://www.linkedin.com/in/jasonrundell/',
      'https://github.com/jasonrundell',
    ],
    description:
      'AI-first Application Development Manager and Senior Full Stack Web Developer with 20+ years leading high-impact web platforms and engineering teams.',
  }
}

/**
 * Builds a schema.org `BlogPosting` object for a single post detail page.
 */
export function buildBlogPostingJsonLd(post: Post, slug: string) {
  const rawUrl = post.featuredImage?.fields?.file?.fields?.file?.url
  const imageUrl = rawUrl
    ? rawUrl.startsWith('//')
      ? `https:${rawUrl}`
      : rawUrl.startsWith('http')
        ? rawUrl
        : `https:${rawUrl}`
    : undefined

  const authorName = post.author?.fields?.name

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || SITE_DESCRIPTION,
    datePublished: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/posts/${slug}`,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(authorName
      ? { author: { '@type': 'Person', name: authorName } }
      : {}),
  }
}

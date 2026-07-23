import type { Metadata } from 'next'

import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_LOCALE,
  SITE_NAME,
} from '@/lib/constants'
import AUTHOR from '@/lib/author'

/** Everything a page needs to describe itself to a crawler or a share card. */
export interface PageMetadataInput {
  /** Full `<title>`, e.g. `About | Jason Rundell`. */
  title: string
  description: string
  /** Site-root-relative path, e.g. `/about`. Use `/` for the home page. */
  path: string
  /** Share image. Root-relative or absolute; falls back to the site card. */
  image?: { src: string; alt: string; width?: number; height?: number }
  /** `article` adds authorship and publication data to the Open Graph tags. */
  type?: 'website' | 'article'
  /** ISO 8601 date. Only meaningful when `type` is `article`. */
  publishedTime?: string
}

/**
 * Resolves a possibly-relative asset path against the canonical site origin.
 * Crawlers that do not honour `metadataBase` need absolute `og:image` URLs.
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return new URL(pathOrUrl, SITE_DOMAIN).toString()
}

/**
 * Builds the canonical + Open Graph + Twitter block for a page.
 *
 * Next.js does not deep-merge `openGraph` or `twitter` from a parent layout -
 * a page that sets either one replaces the whole object. Every page therefore
 * goes through this helper so no page can end up advertising the home page's
 * title on its share card.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)

  const shareImage = image
    ? {
        url: absoluteUrl(image.src),
        alt: image.alt,
        ...(image.width ? { width: image.width } : {}),
        ...(image.height ? { height: image.height } : {}),
      }
    : {
        url: absoluteUrl(OG_IMAGE_PATH),
        alt: OG_IMAGE_ALT,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: AUTHOR.name,
      locale: SITE_LOCALE,
      title,
      description,
      url,
      images: [shareImage],
      ...(type === 'article'
        ? {
            authors: [AUTHOR.name],
            ...(publishedTime ? { publishedTime } : {}),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
    },
  }
}

/**
 * Root metadata: the page-level block for the home page plus the site-wide
 * icon, manifest, and crawler directives that only belong in the root layout.
 */
export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_DOMAIN),
    ...buildPageMetadata({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      path: '/',
    }),
    applicationName: AUTHOR.name,
    authors: [{ name: AUTHOR.name, url: SITE_DOMAIN }],
    creator: AUTHOR.name,
    publisher: AUTHOR.name,
    // Stops iOS Safari turning the years-of-experience figures and similar
    // number runs into tel: links.
    formatDetection: { telephone: false, address: false, email: false },
    manifest: '/site.webmanifest',
    icons: {
      // No `/favicon.ico` entry: src/app/favicon.ico is picked up by the App
      // Router file convention and already emits its own <link rel="icon">.
      icon: [
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        {
          url: '/favicon/favicon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      // No `mask-icon`: Safari pinned tabs require a monochrome SVG, and the
      // brand mark only exists as raster. Safari falls back to the favicon.
      apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    },
    appleWebApp: {
      capable: true,
      title: AUTHOR.name,
      statusBarStyle: 'default',
    },
    other: {
      'msapplication-config': '/favicon/browserconfig.xml',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

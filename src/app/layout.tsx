import React from 'react'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'
import { Newsreader, IBM_Plex_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  HOME_OG_IMAGE_URL,
} from '@/lib/constants'
import '@/styles/globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe')
    .then((axe) => {
      console.log('react-axe loaded')
      axe.default(React, window, 1000)
    })
    .catch(console.error)
}

import '@jasonrundell/dropship/style.css'

import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Jason Rundell',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_DOMAIN,
    images: [{ url: HOME_OG_IMAGE_URL, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
}

/**
 * Root layout component for the application.
 * Provides the HTML structure, metadata, and global components.
 * @param children - The page content to render
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className={GeistSans.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-GZFPYCJVHQ" />
        <SupabaseStatusBanner />
        <header>{MainNav()}</header>
        <main id="main-content" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </main>
        {await Footer()}
      </body>
    </html>
  )
}

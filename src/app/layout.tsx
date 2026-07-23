import React from 'react'
import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'
import { Newsreader, IBM_Plex_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { buildRootMetadata } from '@/lib/metadata'
import Tokens from '@/lib/tokens'
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

export const metadata: Metadata = buildRootMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the nav band (`surfacePrimary`) so mobile browser chrome blends
  // into the top of the page.
  themeColor: Tokens.colors.surfacePrimary.value,
  colorScheme: 'light',
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

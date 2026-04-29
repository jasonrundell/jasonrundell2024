import React from 'react'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import '@/styles/globals.css'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    console.log('react-axe loaded')
    axe.default(React, window, 1000)
  })
}

import '@jasonrundell/dropship/style.css'

import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'
import SupabaseStatusBanner from '@/components/SupabaseStatusBanner'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text during font load
})

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
    <html lang="en">
      <body className={outfit.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-GZFPYCJVHQ" />
        <SupabaseStatusBanner />
        <header>{await MainNav()}</header>
        <main id="main-content">{children}</main>
        {await Footer()}
      </body>
    </html>
  )
}

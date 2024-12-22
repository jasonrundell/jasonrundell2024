import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    console.log('react-axe loaded')
    axe.default(React, window, 1000)
  })
}

import './globals.css'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

const outfit = Outfit({ subsets: ['latin'] })

const MainNav = dynamic(() => import('@/components/MainNav'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-GZFPYCJVHQ" />
        <MainNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
